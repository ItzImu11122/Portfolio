export function getValidImageUrl(url: string, fallback: string = 'https://placehold.co/600x400/png?text=No+Image'): string {
  if (!url) return fallback;
  
  let cleanedUrl = url.trim();
  
  // 1. Check for standard clean image URL format
  if ((cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) && 
      !cleanedUrl.includes('<') && !cleanedUrl.includes('[') && !cleanedUrl.includes(' ')) {
    return cleanedUrl;
  }
  
  // 2. Try HTML src attribute with double quotes, single quotes, or HTML entity quotes
  const htmlPatterns = [
    /src="([^"]+)"/i,
    /src='([^']+)'/i,
    /src=&quot;([^&]+)&quot;/i,
    /src=&#34;([^&#]+)&#34;/i
  ];
  
  for (const pattern of htmlPatterns) {
    const match = cleanedUrl.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 3. Try BBCode [img]URL[/img]
  const bbcodeMatch = cleanedUrl.match(/\[img\]([^\[]+)\[\/img\]/i);
  if (bbcodeMatch && bbcodeMatch[1]) {
    return bbcodeMatch[1].trim();
  }

  // 4. Fallback scanner: extract any http/https URL that looks like an image link
  const generalUrlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const urlsFound = cleanedUrl.match(generalUrlRegex);
  if (urlsFound && urlsFound.length > 0) {
    // Look for one ending in image extensions or containing "ibb.co" / "firebasestorage"
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
    for (const found of urlsFound) {
      const lower = found.toLowerCase();
      if (imageExtensions.some(ext => lower.includes(ext)) || lower.includes('ibb.co') || lower.includes('firebasestorage')) {
        return found;
      }
    }
    // If none match specifically, just return the first HTTP link found as a fallback
    return urlsFound[0];
  }
  
  // 5. Relative paths
  if (cleanedUrl.startsWith('/')) {
    return cleanedUrl;
  }
  
  return fallback;
}
