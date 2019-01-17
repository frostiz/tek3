library globals;

class User {
	String accountId = '';
	String username = '';
	String accessToken = '';
	String refreshToken = '';

	bool isAuth() {
		if (accessToken.isNotEmpty)
			return true;
		return false;
	}

	void reset() {
		this.accountId = '';
		this.username = '';
		this.accessToken = '';
		this.refreshToken = '';
	}
}

User user = new User();