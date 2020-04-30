exports.handler = (event, context, callback) => {
  console.log('event:', event);
  const token = event.authorizationToken;
  console.log('token:', token);
  // Use token
  if (token === 'allow') {
    const policy = genPolicy('allow', event.methodArn);
    const principalId = 'u10001';
    const context = {
      simpleAuth: true
    };
    const response = {
      principalId: principalId,
      policyDocument: policy,
      context: context
    };
    callback(null, response);
  } else if (token === 'deny') {
    const policy = genPolicy('deny', event.methodArn);
    const principalId = 'u10001';
    const context = {
      simpleAuth: true
    };
    const response = {
      principalId: principalId,
      policyDocument: policy,
      context: context
    };
    callback(null, response);
  } else {
    callback('Unauthorized');
  }
};

function genPolicy(effect, resource) {
  const policy = {};
  policy.Version = '2012-10-17';
  policy.Statement = [];
  const stmt = {};
  stmt.Action = 'execute-api:Invoke';
  stmt.Effect = effect;
  stmt.Resource = resource;
  policy.Statement.push(stmt);
  return policy;
}
