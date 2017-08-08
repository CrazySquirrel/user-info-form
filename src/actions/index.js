export const submitUserData = (user) => {
  return {
    type: 'SUBMIT_USER_DATA',
    payload: {
      promise: (
          new Promise((resolve, reject) => {
            setTimeout(
                () => {
                  resolve(user);
                },
                5000
            )
          })
      )
    }
  }
};

export const resetLoadingState = () => {
  return {
    type: 'RESET_LOADING_STATE',
  };
};