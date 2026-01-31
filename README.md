# ArchBot - Discord System Bot

A Discord bot that supports running system commands and managing the server.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file with your Bot Token:
   ```
   DISCORD_ARCH_TOKEN=your_bot_token_here
   ./compress-env restore  -p <password>  # If using compress-env
   ```
4. Run the bot:
   ```bash
   yarn dev   # Development mode
   yarn start # Production mode
   ```

## Usage Guide

### 1. `/cmd <command>` - Run shell commands

Execute shell commands directly on the server.

**Examples:**
```
/cmd ls -la
/cmd pwd
/cmd whoami
```

### 2. `@ArchBot ip` - Get public IP

Mention the bot with the keyword `ip` to get the server's public IP address.

**Examples:**
```
@ArchBot ip
@ArchBot show me ip
```
## Security Notes

⚠️ **Warning:** The `/cmd` command can execute any shell command. Use the bot only in private servers and restrict access permissions.

## Author

[cavaldos](https://github.com/cavaldos)
