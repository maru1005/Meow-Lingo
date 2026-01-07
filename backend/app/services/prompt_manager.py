# backend/app/services/prompt_manager.py
import os

class PromptManager:
    def __init__(self):
        # プロンプトファイルが置いてあるディレクトリを指定
        self.prompt_dir = os.path.join(os.path.dirname(__file__), "..", "prompts")

    def get_prompt(self, filename: str) -> str:
        """指定されたファイル名のプロンプトを読み込むニャ"""
        file_path = os.path.join(self.prompt_dir, filename)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            print(f"⚠️ プロンプトファイルが見つからないニャ: {filename}")
            return ""

# インスタンス化しておく
prompt_manager = PromptManager()