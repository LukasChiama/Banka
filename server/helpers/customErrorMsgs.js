const customErrorMessages = {
  numeric: ':attribute should contain only numbers.',
  digits: ':attribute should be :digits digits long.',
  min: ':attribute should not be less than :min.',
  max: ':attribute should not be more than :max.',
  required: ':attribute is required',
  email: ':attribute should be a valid email address',
  alpha_dash: ':attribute should contain only aplphabets, numbers, underscores and dashes',
  alpha: ':attribute should contain only letters.',
  boolean: ':attribute should be boolean: true or false.',
  in: ':attribute should be one of the following: :in.',
};

export default customErrorMessages;
