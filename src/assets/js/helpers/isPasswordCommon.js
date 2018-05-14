/* See https://en.wikipedia.org/wiki/List_of_the_most_common_passwords */
const isPasswordCommon = password => [
	'password',
	'12345',
	'letmein',
	'1234567',
	'football',
	'iloveyou',
	'admin',
	'welcome',
	'monkey',
	'login',
	'abc1234',
	'123456',
	'123456789',
	'qwerty',
	'12345678',
	'111111',
	'1234567890',
	'123123',
	'987654321',
	'qwertyuiop',
	'mynoob',
	'123321',
	'666666',
	'18atcskd2w',
	'7777777',
	'1q2w3e4r',
	'654321',
	'555555',
	'3rjs1la7qe',
	'google',
	'1q2w3e4r5t',
	'123qwe',
	'zxcvbnm',
	'1q2w3e',
].includes(password.toLowerCase());

export default isPasswordCommon;
