import zxcvbn from 'zxcvbn';
import React, { Fragment } from 'react';

const PasswordStrengthMeter = ({ password }) => {
	let progressBar = 0;

	let progressText = '';

	let progressTextCSS = 'mt-2';

	let progressCSS = 'progress-bar';

	const evaluation = zxcvbn(password);

	progressBar = Math.floor((evaluation.score / 4) * 100);

	switch (evaluation.score) {
		case 0:
		case 1:
			progressBar = 25;
			progressCSS += ' bg-danger';
			progressTextCSS += ' text-danger';
			progressText = '- Password is weak.';

			break;
		case 2:
			progressCSS += ' bg-danger';
			progressTextCSS += ' text-danger';
			progressText = '- Password is weak.';

			break;
		case 3:
			progressCSS += ' bg-warning';
			progressTextCSS += ' text-warning';
			progressText = '- Password is good.';

			break;
		case 4:
			progressCSS += ' bg-success';
			progressTextCSS += ' text-success';
			progressText = '- Password is strong.';

			break;
		default:
			break;
	}

	return (
		<Fragment>
			<div className="progress mt-2" style={{ height: '2px' }}>
				<div className={progressCSS} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressBar} style={{ width: `${progressBar}%` }}></div>
			</div>
			<div className={progressTextCSS}>{progressText}</div>
		</Fragment>
	);
};

export default PasswordStrengthMeter;
