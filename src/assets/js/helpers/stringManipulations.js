const truncateText = data => ((data.length > 12) ? data.substr(0, 12).concat('...') : data);

export default truncateText;
