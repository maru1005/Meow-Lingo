# backend/app/services/prompt_manager.py

import os

class PromptManager:
    def __init__(self, prompt_dir: str = "app/prompts"):
        # プロンプトファイルが入っているディレクトリパス
        self.prompt_dir = prompt_dir

    def get_prompt(self, filename: str) -> str:
        # 💡 ここでファイルを探して中身を返すロジック
        path = os.path.join(self.prompt_dir, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            return "あなたは親切な英語学習アシスタントです。" # デフォルト


prompt_manager = PromptManager()