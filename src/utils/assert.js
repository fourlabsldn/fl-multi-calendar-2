// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false

function processCondition(condition, errorMessage) {
  if (!condition) {
    let completeErrorMessage = '';


    // The assert function is calling this processCondition and we are
    // really interested is in who is calling the assert function.
    const assertFunction = processCondition.caller;

    if (!assertFunction) {
      // The program should never ever ever come here.
      throw new Error('No "assert" function as a caller?');
    }

    if (assertFunction.caller && assertFunction.caller.name) {
      completeErrorMessage = `${assertFunction.caller.name}: `;
    }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

function assert(...args) {
  const error = processCondition(...args);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

assert.warn = function warn(...args) {
  const error = processCondition(...args);
  if (typeof error === 'string') {
    console.warn(error);
  }
};


export default assert;
