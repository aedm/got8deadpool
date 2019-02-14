// Helper function for submitting forms by calling Meteor methods and setting React state
import {Logger} from "/src/lib/logger.js";

export function SubmitWithState(reactComponent, methodName, params) {
  Logger.debug(`Calling "${methodName}"`);
  reactComponent.setState({
    isSubmitting: true,
    isSubmitted: false,
    submitErrorMessage: null,
  });
  Meteor.call(methodName, params, (error, result) => {
    if (error) {
      Logger.debug(`Error calling "${methodName}":`, error);
      reactComponent.setState({
        isSubmitting: false,
        isSubmitted: true,
        submitErrorMessage: error.error,
      });
      return;
    }
    Logger.debug(`Method "${methodName}" completed.`);
    reactComponent.setState({
      isSubmitting: false,
      isSubmitted: true,
      submitErrorMessage: null,
    });
  });
}