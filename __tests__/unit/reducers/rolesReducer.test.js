import rolesReducer from '../../../src/assets/js/reducers/rolesReducer';

import { GET_ROLE, GET_ROLES, CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE } from '../../../src/assets/js/actions/actionTypes';

const findRole = (roles, roleId) => (roles.length ? roles.find(role => role.roleId === roleId) : null);

describe('Roles Reducer', () => {
	let mockRoles;

	beforeEach(() => {
		mockRoles = [{
			roleId: 1,
			roleName: 'Bar Manager',
		}];
	});

	it('should return the initial state', () => expect(rolesReducer(undefined, [])).toEqual([]));

	it('should handle GET_ROLE', () => {
		const mockRole = mockRoles[0];

		const action = {
			type: GET_ROLE,
			role: mockRole,
		};

		const roles = rolesReducer(mockRoles, action);

		const role = findRole(roles, mockRole.roleId);

		expect(role).toEqual(mockRole);
	});

	it('should handle GET_ROLES', () => {
		const action = {
			type: GET_ROLES,
			roles: mockRoles,
		};

		expect(rolesReducer(mockRoles, action)).toEqual(mockRoles);
	});

	it('should handle CREATE_ROLE', () => {
		const mockRole = {
			roleId: 1,
			roleName: 'Bar Manager',
		};

		const action = {
			type: CREATE_ROLE,
			role: mockRole,
		};

		const roles = rolesReducer(mockRoles, action);

		expect(roles.length).toEqual(2);
	});

	it('should handle UPDATE_ROLE', () => {
		const mockRole = mockRoles[0];

		mockRole.roleName = 'Waiter';

		const action = {
			type: UPDATE_ROLE,
			role: mockRole,
		};

		const roles = rolesReducer(mockRoles, action);

		const role = findRole(roles, mockRole.roleId);

		expect(role.roleName).toEqual(mockRole.roleName);
	});

	it('should handle DELETE_ROLE', () => {
		const mockRole = mockRoles[0];

		const action = {
			type: DELETE_ROLE,
			role: mockRole,
		};

		const roles = rolesReducer(mockRoles, action);

		expect(roles.length).toEqual(0);
	});
});
