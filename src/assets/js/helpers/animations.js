const scrollToTop = () => {
	const scrollToTopInterval = window.setInterval(() => {
		const position = window.pageYOffset;

		if (position > 0) {
			window.scrollTo(0, position - 20);
		} else {
			window.clearInterval(scrollToTopInterval);
		}
	}, 16);
};

export default scrollToTop;
