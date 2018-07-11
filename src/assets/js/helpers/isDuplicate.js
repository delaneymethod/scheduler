const isDuplicate = (needle, haystack) => haystack.map(data => data.toLowerCase()).includes(needle.toLowerCase());

export default isDuplicate;
