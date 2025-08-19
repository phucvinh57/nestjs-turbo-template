export const extractUrlsFromContent = (content: string): string[] => {
	return content.match(/https?:\/\/[^\s,()[\]]+/g) ?? [];
};
