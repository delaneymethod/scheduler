import { addClass, removeClass } from '../../../src/assets/js/helpers/classes';

describe('Classes', () => {
	let div;

	beforeEach(() => {
		div = document.createElement('div');
	});

	it('should add a single class', () => {
		addClass(div, 'bg-danger');

		expect(div.getAttribute('class')).toEqual('bg-danger');
	});

	it('should add multiple classes', () => {
		div.setAttribute('class', 'col-12');

		expect(div.getAttribute('class')).not.toBe('undefined');

		addClass(div, 'bg-danger');

		expect(div.getAttribute('class')).toEqual('col-12 bg-danger');
	});

	it('should remove a single class', () => {
		addClass(div, 'bg-danger d-flex');

		removeClass(div, 'bg-danger');

		expect(div.getAttribute('class')).toEqual('d-flex');
	});

	it('should remove a class that already exists', () => {
		div.setAttribute('class', 'col-12');

		removeClass(div, 'bg-danger');

		expect(div.getAttribute('class')).toEqual('col-12');
	});

	it('should remove classes and class attribute if no class attribute exists', () => {
		removeClass(div, 'col-12');

		expect(div.hasAttribute('class')).toEqual(false);
	});
});
