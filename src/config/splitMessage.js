const splitMessage = (text) => {
    const maxLength = 2000;
    const chunks = [];
    const codeBlockRegex = /```[\s\S]*?```/g;
    let lastIndex = 0;
    let match;

    // Xử lý từng code block và text thường
    while ((match = codeBlockRegex.exec(text)) !== null) {
        const codeBlock = match[0];
        const textBefore = text.slice(lastIndex, match.index);

        // Chia text thường thành chunks
        if (textBefore.length > 0) {
            const textChunks = textBefore.match(/[\s\S]{1,1994}/g) || [];
            textChunks.forEach(chunk => chunks.push(chunk));
        }

        // Chia code block nếu quá dài
        if (codeBlock.length > maxLength) {
            const codeContent = codeBlock.slice(3, -3); // Bỏ dấu ```
            const codeChunks = codeContent.match(/[\s\S]{1,1994}/g) || [];
            codeChunks.forEach((chunk, index) => {
                chunks.push(`\`\`\`${index === 0 ? 'cpp' : ''}\n${chunk}\n\`\`\``);
            });
        } else {
            chunks.push(codeBlock);
        }

        lastIndex = codeBlockRegex.lastIndex;
    }

    // Xử lý phần còn lại sau code block cuối
    const remainingText = text.slice(lastIndex);
    if (remainingText.length > 0) {
        const remainingChunks = remainingText.match(/[\s\S]{1,2000}/g) || [];
        remainingChunks.forEach(chunk => chunks.push(chunk));
    }

    return chunks;
};

module.exports = splitMessage;