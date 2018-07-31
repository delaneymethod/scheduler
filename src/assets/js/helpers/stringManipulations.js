const truncateText = data => ((data.length > 14) ? data.substr(0, 14).concat('...') : data);

export default truncateText;
