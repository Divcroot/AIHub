const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

export interface TextChunk {
    content: string;
    chunkIndex: number;
}

export const chunkText = (text: string): TextChunk[] => {
    const cleanedText = text
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    if (!cleanedText) {
        return [];
    }

    const chunks: TextChunk[] = [];

    let start = 0;
    let chunkIndex = 0;

    while (start < cleanedText.length) {
        let end = Math.min(
            start + CHUNK_SIZE,
            cleanedText.length
        );

        // Try to end at a natural boundary.
        if (end < cleanedText.length) {
            const paragraphBreak = cleanedText.lastIndexOf(
                "\n\n",
                end
            );

            const sentenceBreak = cleanedText.lastIndexOf(
                ". ",
                end
            );

            const spaceBreak = cleanedText.lastIndexOf(
                " ",
                end
            );

            if (paragraphBreak > start + CHUNK_SIZE * 0.5) {
                end = paragraphBreak;
            } else if (sentenceBreak > start + CHUNK_SIZE * 0.5) {
                end = sentenceBreak + 1;
            } else if (spaceBreak > start) {
                end = spaceBreak;
            }
        }

        const content = cleanedText
            .slice(start, end)
            .trim();

        if (content) {
            chunks.push({
                content,
                chunkIndex
            });

            chunkIndex++;
        }

        if (end >= cleanedText.length) {
            break;
        }

        start = Math.max(
            end - CHUNK_OVERLAP,
            start + 1
        );
    }

    return chunks;
};