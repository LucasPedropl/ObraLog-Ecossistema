import { authService as sharedAuthService } from '@obralog/shared-services';
import { User } from '@obralog/shared-types';

// Re-export shared auth service
export const authService = {
	login: sharedAuthService.login,
	register: sharedAuthService.register,
	logout: sharedAuthService.logout,
	getCurrentUser: sharedAuthService.getCurrentUser,
	onAuthChanged: sharedAuthService.onAuthChanged,
};
