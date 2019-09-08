<template>
	<div /> <!-- redirect only -->
</template>

<script>
export default {
	middleware: [
		'auth',
		({ $auth, redirect, app }) => {
			const nextRoute = $auth.user.is_owner ? 'user-venues' : 'user-info'

			redirect(app.localePath(nextRoute))
		}
	]
}
</script>
