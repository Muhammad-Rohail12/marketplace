const { jwtUtil, passwordUtil, cookieUtil } = require('./src/auth');

(async () => {
   const payload = { id: 1, role: 'BUYER' };

   const accessToken = jwtUtil.generateAccessToken(payload);
   const refreshToken = jwtUtil.generateRefreshToken(payload);
   console.log('Access token:', accessToken.slice(0, 20) + '...');

   const decoded = jwtUtil.verifyAccessToken(accessToken);
   console.log('Verified payload:', decoded);

   const hash = await passwordUtil.hashPassword('TestPass123');
   console.log('Hash:', hash.slice(0, 20) + '...');

   const isMatch = await passwordUtil.comparePassword('TestPass123', hash);
   const isWrong = await passwordUtil.comparePassword('WrongPass', hash);
   console.log('Correct password matches:', isMatch);
   console.log('Wrong password matches:', isWrong);

   console.log('Refresh cookie options:', cookieUtil.getRefreshTokenCookieOptions());

   try {
     jwtUtil.verifyAccessToken('not-a-real-token');
   } catch (err) {
     console.log('Invalid token correctly threw:', err.name);
   }
})();
