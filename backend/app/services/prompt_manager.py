import os
import logging

logger = logging.getLogger(__name__)

class PromptManager:
    def __init__(self, prompt_dir: str = "app/prompts", preload: bool = False):
        # プロンプトファイルが入っているディレクトリパス
        self.prompt_dir = prompt_dir
        # メモリキャッシュ
        self._cache: dict[str, str] = {}
        self._default_prompt = "あなたは親切な英語学習アシスタントです。"
        
        if preload:
            self._preload_all_prompts()

    def _preload_all_prompts(self) -> None:
        """起動時に全プロンプトをメモリに読み込む"""
        if not os.path.exists(self.prompt_dir):
            logger.warning(f"Prompt directory not found: {self.prompt_dir}")
            return
        
        for filename in os.listdir(self.prompt_dir):
            if filename.endswith(".txt"):
                self._load_from_file(filename)

    def _load_from_file(self, filename: str) -> str:
        """ファイルから読み込みキャッシュに保存"""
        path = os.path.join(self.prompt_dir, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                self._cache[filename] = content
                return content
        except FileNotFoundError:
            logger.warning(f"Prompt file not found: {filename}")
            # フォールバック: system_prompt.txt を優先的に使用
            fallback = os.path.join(self.prompt_dir, "system_prompt.txt")
            try:
                with open(fallback, "r", encoding="utf-8") as f:
                    content = f.read()
                    # 参照元のキー（存在しないファイル名）にもキャッシュしておく
                    self._cache[filename] = content
                    return content
            except FileNotFoundError:
                logger.warning("system_prompt.txt not found. Using default inline prompt.")
                return self._default_prompt

    def get_prompt(self, filename: str) -> str:
        """キャッシュがあれば取得、なければファイルから読み込み"""
        if filename in self._cache:
            return self._cache[filename]
        
        return self._load_from_file(filename)

    MODE_TO_FILE = {
        "study": "system_prompt.txt",
        "vocabulary": "vocabulary.txt",
        "grammar": "grammar.txt",
        "test": "quiz.txt",
        # backward-compatible alias
        "system_prompt": "system_prompt.txt",
        # additional modes
        "example": "example.txt",
        "learning_advice": "learning_advice.txt",
        "fallback": "fallback.txt",
    }

    def get_prompt_for_mode(self, mode: str) -> str:
        """chat_modeからプロンプトファイルを安全に解決する"""
        filename = self.MODE_TO_FILE.get(mode)
        if filename:
            return self.get_prompt(filename)

        logger.warning(f"Unknown chat_mode: {mode}. Falling back to fallback.txt")
        # fallback.txt が無い場合でも get_prompt が system_prompt.txt に落とす
        return self.get_prompt("fallback.txt")

    def clear_cache(self) -> None:
        """キャッシュをクリア"""
        self._cache.clear()


prompt_manager = PromptManager(preload=True)