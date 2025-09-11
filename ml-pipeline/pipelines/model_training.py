"""
Model training module for PyStockBot using Polars DataFrames and scikit-learn/XGBoost
"""
import polars as pl
import numpy as np
import pickle
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')


class ModelTrainer:
    """Handles model training and evaluation for stock prediction"""
    
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.models = {}
        self.model_scores = {}
        self.feature_importance = {}
    
    def prepare_data_for_training(self, df: pl.DataFrame, 
                                target_columns: List[str],
                                exclude_patterns: List[str] = None) -> Tuple[np.ndarray, Dict[str, np.ndarray], List[str]]:
        """
        Prepare Polars DataFrame for scikit-learn training
        
        Args:
            df: Input Polars DataFrame with features and targets
            target_columns: List of target column names
            exclude_patterns: Patterns to exclude from features (e.g., ['target_', 'future_'])
        
        Returns:
            Tuple of (features_array, targets_dict, feature_names)
        """
        if exclude_patterns is None:
            exclude_patterns = ['target_', 'future_', 'up_down_']
        
        # Get feature columns (exclude date, targets, and specified patterns)
        feature_columns = [
            col for col in df.columns 
            if col != 'date' 
            and col not in target_columns 
            and not any(pattern in col for pattern in exclude_patterns)
        ]
        
        print(f"Selected {len(feature_columns)} feature columns for training")
        
        # Remove rows with any null values in features or targets
        columns_to_check = feature_columns + target_columns
        df_clean = df.select(columns_to_check).drop_nulls()
        
        print(f"After removing nulls: {df_clean.height} rows (from {df.height})")
        
        if df_clean.height == 0:
            raise ValueError("No data remaining after removing nulls")
        
        # Extract features
        features = df_clean.select(feature_columns).to_numpy()
        
        # Extract targets
        targets = {
            target: df_clean.select(target).to_numpy().flatten()
            for target in target_columns
            if target in df_clean.columns
        }
        
        # Warn about missing targets
        missing_targets = [target for target in target_columns if target not in df_clean.columns]
        for target in missing_targets:
            print(f"Warning: Target column '{target}' not found in data")
        
        return features, targets, feature_columns
    
    def _get_model_configs(self, task_type: str) -> Dict[str, Any]:
        """Get model configurations for a given task type"""
        base_config = {'random_state': self.random_state}
        
        if task_type == 'regression':
            return {
                'linear_regression': LinearRegression(),
                'random_forest': RandomForestRegressor(n_estimators=100, **base_config),
                'xgboost': xgb.XGBRegressor(n_estimators=100, verbosity=0, **base_config)
            }
        else:  # classification
            return {
                'logistic_regression': LogisticRegression(max_iter=1000, **base_config),
                'random_forest': RandomForestClassifier(n_estimators=100, **base_config),
                'xgboost': xgb.XGBClassifier(n_estimators=100, verbosity=0, **base_config)
            }
    
    def _evaluate_model(self, model: Any, X_test: np.ndarray, y_test: np.ndarray, 
                       X_train: np.ndarray, y_train: np.ndarray, task_type: str) -> Dict[str, float]:
        """Evaluate a model based on task type"""
        y_pred = model.predict(X_test)
        
        if task_type == 'regression':
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
            return {
                'mse': mean_squared_error(y_test, y_pred),
                'mae': mean_absolute_error(y_test, y_pred),
                'r2': r2_score(y_test, y_pred),
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'main_score': r2_score(y_test, y_pred)
            }
        else:  # classification
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
            return {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='weighted', zero_division=0),
                'recall': recall_score(y_test, y_pred, average='weighted', zero_division=0),
                'f1': f1_score(y_test, y_pred, average='weighted', zero_division=0),
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'main_score': f1_score(y_test, y_pred, average='weighted', zero_division=0)
            }

    def train_models_by_type(self, X: np.ndarray, y: np.ndarray, 
                            target_name: str, feature_names: List[str], 
                            task_type: str) -> Dict[str, Any]:
        """Train models for either regression or classification"""
        models = self._get_model_configs(task_type)
        
        split_args = {'test_size': 0.2, 'random_state': self.random_state}
        if task_type == 'classification':
            split_args['stratify'] = y
            
        X_train, X_test, y_train, y_test = train_test_split(X, y, **split_args)
        
        print(f"\nTraining {task_type} models for {target_name}:")
        
        # Train and evaluate all models
        results = {}
        for name, model in models.items():
            print(f"  Training {name}...")
            model.fit(X_train, y_train)
            
            metrics = self._evaluate_model(model, X_test, y_test, X_train, y_train, task_type)
            results[name] = {'model': model, **metrics}
            
            # Print relevant metrics
            if task_type == 'regression':
                print(f"    R² Score: {metrics['r2']:.4f}, MSE: {metrics['mse']:.6f}, CV R²: {metrics['cv_mean']:.4f} ± {metrics['cv_std']:.4f}")
            else:
                print(f"    Accuracy: {metrics['accuracy']:.4f}, F1: {metrics['f1']:.4f}, CV Acc: {metrics['cv_mean']:.4f} ± {metrics['cv_std']:.4f}")
        
        # Find best model
        best_name = max(results.keys(), key=lambda k: results[k]['main_score'])
        best_result = results[best_name]
        
        score_name = 'R²' if task_type == 'regression' else 'F1'
        print(f"  Best model: {best_name} ({score_name} = {best_result['main_score']:.4f})")
        
        # Store feature importance for tree-based models
        if best_name in ['random_forest', 'xgboost']:
            importance = best_result['model'].feature_importances_
            feature_importance = sorted(zip(feature_names, importance), key=lambda x: x[1], reverse=True)
            self.feature_importance[target_name] = feature_importance[:20]
        
        return best_result
    
    def train_regression_models(self, X: np.ndarray, y: np.ndarray, 
                              target_name: str, feature_names: List[str]) -> Dict[str, Any]:
        """Train multiple regression models and return the best one"""
        return self.train_models_by_type(X, y, target_name, feature_names, 'regression')
    
    def train_classification_models(self, X: np.ndarray, y: np.ndarray, 
                                  target_name: str, feature_names: List[str]) -> Dict[str, Any]:
        """Train multiple classification models and return the best one"""
        return self.train_models_by_type(X, y, target_name, feature_names, 'classification')
    
    def hyperparameter_tuning(self, X: np.ndarray, y: np.ndarray, 
                            model_type: str = 'xgboost', 
                            task_type: str = 'regression') -> Any:
        """
        Perform hyperparameter tuning for the specified model
        
        Args:
            X: Feature matrix
            y: Target vector
            model_type: Type of model ('xgboost', 'random_forest')
            task_type: Type of task ('regression', 'classification')
        
        Returns:
            Best model after hyperparameter tuning
        """
        print(f"\nPerforming hyperparameter tuning for {model_type} ({task_type})...")
        
        # Model and parameter configurations
        model_configs = {
            'xgboost': {
                'regression': (xgb.XGBRegressor, 'r2'),
                'classification': (xgb.XGBClassifier, 'f1_weighted'),
                'params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [3, 5, 7],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'subsample': [0.8, 0.9, 1.0]
                }
            },
            'random_forest': {
                'regression': (RandomForestRegressor, 'r2'),
                'classification': (RandomForestClassifier, 'f1_weighted'),
                'params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [None, 5, 10, 20],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4]
                }
            }
        }
        
        if model_type not in model_configs:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        config = model_configs[model_type]
        model_class, scoring = config[task_type]
        param_grid = config['params']
        
        base_model = model_class(random_state=self.random_state, **({'verbosity': 0} if 'xgb' in model_class.__name__ else {}))
        
        # Perform grid search
        grid_search = GridSearchCV(
            base_model, param_grid, cv=3, scoring=scoring, 
            n_jobs=-1, verbose=0
        )
        
        grid_search.fit(X, y)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def train_all_models(self, df: pl.DataFrame, 
                        regression_targets: List[str] = None,
                        classification_targets: List[str] = None,
                        perform_tuning: bool = False) -> Dict[str, Any]:
        """
        Train all models for given targets
        
        Args:
            df: Input DataFrame with features and targets
            regression_targets: List of regression target columns
            classification_targets: List of classification target columns  
            perform_tuning: Whether to perform hyperparameter tuning
        
        Returns:
            Dictionary containing all trained models and results
        """
        if regression_targets is None:
            regression_targets = []
        if classification_targets is None:
            classification_targets = []
        
        all_targets = regression_targets + classification_targets
        
        if not all_targets:
            raise ValueError("No targets specified for training")
        
        print(f"Preparing data for training with {len(all_targets)} targets...")
        
        # Prepare data
        X, targets, feature_names = self.prepare_data_for_training(df, all_targets)
        
        print(f"Training data shape: {X.shape}")
        print(f"Feature count: {len(feature_names)}")
        
        # Consolidated training for both regression and classification
        from functools import reduce
        
        def train_target_group(results, target_config):
            target_list, task_type, train_func = target_config
            
            def train_single_target(res, target):
                if target not in targets:
                    return res
                    
                print(f"\n{'='*50}")
                print(f"Training {task_type} models for: {target}")
                print(f"{'='*50}")
                
                y = targets[target].astype(int) if task_type == 'classification' else targets[target]
                
                if perform_tuning:
                    tuned_model = self.hyperparameter_tuning(X, y, 'xgboost', task_type)
                    res[target] = {'model': tuned_model, 'type': task_type, 'tuned': True}
                else:
                    best_result = train_func(X, y, target, feature_names)
                    res[target] = {**best_result, 'type': task_type, 'tuned': False}
                
                return res
            
            return reduce(train_single_target, target_list, results)
        
        # Train all models using functional approach
        target_configs = [
            (regression_targets, 'regression', self.train_regression_models),
            (classification_targets, 'classification', self.train_classification_models)
        ]
        
        results = reduce(train_target_group, target_configs, {})
        
        self.models = results
        return results
    
    def save_models(self, filepath: str):
        """Save all trained models to file"""
        model_data = {
            'models': self.models,
            'feature_importance': self.feature_importance,
            'random_state': self.random_state
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Models saved to {filepath}")
    
    def load_models(self, filepath: str):
        """Load models from file"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.models = model_data['models']
        self.feature_importance = model_data.get('feature_importance', {})
        self.random_state = model_data.get('random_state', 42)
        
        print(f"Models loaded from {filepath}")
        print(f"Loaded {len(self.models)} models")
    
    def predict(self, df: pl.DataFrame, target_name: str) -> np.ndarray:
        """Make predictions using a trained model"""
        if target_name not in self.models:
            raise ValueError(f"Model for target '{target_name}' not found")
        
        # Prepare features (this should match training preparation)
        exclude_patterns = ['target_', 'future_', 'up_down_']
        feature_columns = [
            col for col in df.columns 
            if col != 'date' and not any(pattern in col for pattern in exclude_patterns)
        ]
        
        X = df.select(feature_columns).drop_nulls().to_numpy()
        model = self.models[target_name]['model']
        
        return model.predict(X)
    
    def get_feature_importance(self, target_name: str, top_n: int = 10) -> List[Tuple[str, float]]:
        """Get feature importance for a specific target"""
        if target_name in self.feature_importance:
            return self.feature_importance[target_name][:top_n]
        else:
            return []
    
    def print_model_summary(self):
        """Print summary of all trained models"""
        print("\n" + "="*80)
        print("MODEL TRAINING SUMMARY")
        print("="*80)
        
        for target, result in self.models.items():
            print(f"\nTarget: {target}")
            print(f"Type: {result['type']}")
            print(f"Model: {type(result['model']).__name__}")
            
            if result['type'] == 'regression':
                if 'r2' in result:
                    print(f"R² Score: {result['r2']:.4f}")
                if 'mse' in result:
                    print(f"MSE: {result['mse']:.6f}")
                if 'cv_mean' in result:
                    print(f"CV R²: {result['cv_mean']:.4f} ± {result['cv_std']:.4f}")
            
            elif result['type'] == 'classification':
                if 'accuracy' in result:
                    print(f"Accuracy: {result['accuracy']:.4f}")
                if 'f1' in result:
                    print(f"F1 Score: {result['f1']:.4f}")
                if 'cv_mean' in result:
                    print(f"CV Accuracy: {result['cv_mean']:.4f} ± {result['cv_std']:.4f}")
            
            # Print top features if available
            if target in self.feature_importance:
                print("Top 5 features:")
                for i, (feature, importance) in enumerate(self.feature_importance[target][:5]):
                    print(f"  {i+1}. {feature}: {importance:.4f}")
        
        print("\n" + "="*80)


if __name__ == "__main__":
    # Example usage
    from data_ingestion import download_stock_data
    from technical_indicators import apply_all_technical_indicators
    from feature_engineering import create_comprehensive_features
    
    # Create sample data for testing
    stock_data = download_stock_data("AAPL", start_date=datetime(2022, 1, 1))
    
    # Add technical indicators
    stock_data = apply_all_technical_indicators(stock_data)
    
    # Add comprehensive features
    stock_data = create_comprehensive_features(stock_data)
    
    # Create targets
    stock_data = stock_data.with_columns([
        # Regression target: 1-day future return
        ((pl.col("close").shift(-1) - pl.col("close")) / pl.col("close") * 100).alias("target_return_1d"),
        # Classification target: up/down in 1 day
        (pl.col("close").shift(-1) > pl.col("close")).cast(pl.Int32).alias("target_up_down_1d")
    ])
    
    # Remove last row (no future data)
    stock_data = stock_data.head(stock_data.height - 1)
    
    # Initialize trainer
    trainer = ModelTrainer()
    
    # Train models
    results = trainer.train_all_models(
        stock_data,
        regression_targets=["target_return_1d"],
        classification_targets=["target_up_down_1d"],
        perform_tuning=False  # Set to True for hyperparameter tuning
    )
    
    # Print summary
    trainer.print_model_summary()
    
    # Save models
    trainer.save_models("../../data/trained_models.pkl")