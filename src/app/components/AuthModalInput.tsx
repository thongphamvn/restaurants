type Inputs = {
  firstName: string
  lastName: string
  phone: string
  city: string
  email: string
  password: string
}

export default function AuthModalInput({
  inputs,
  isSignin,
  onInputsChange,
}: {
  isSignin: boolean
  inputs: Inputs
  onInputsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const { firstName, lastName, phone, city, email, password } = inputs

  return (
    <div>
      {isSignin ? null : (
        <>
          <div className='my-3 flex justify-between text-sm'>
            <input
              placeholder='First name'
              className='rounded border p-2 py-3 w-[49%]'
              type='text'
              value={firstName}
              name='firstName'
              onChange={onInputsChange}
            />
            <input
              placeholder='Last name'
              className='rounded border p-2 py-3 w-[49%]'
              type='text'
              name='lastName'
              value={lastName}
              onChange={onInputsChange}
            />
          </div>

          <div className='my-3 flex justify-between text-sm'>
            <input
              placeholder='Phone'
              className='rounded border p-2 py-3 w-[49%]'
              type='text'
              name='phone'
              value={phone}
              onChange={onInputsChange}
            />
            <input
              placeholder='City'
              className='rounded border p-2 py-3 w-[49%]'
              type='text'
              value={city}
              onChange={onInputsChange}
              name='city'
            />
          </div>
        </>
      )}

      <div className='my-3 flex justify-between text-sm'>
        <input
          placeholder='Email'
          className='rounded border p-2 py-3 w-full'
          type='email'
          value={email}
          onChange={onInputsChange}
          name='email'
        />
      </div>
      <div className='my-3 flex justify-between  text-sm'>
        <input
          placeholder='Password'
          className='rounded border p-2 py-3 w-full'
          type='password'
          value={password}
          onChange={onInputsChange}
          name='password'
        />
      </div>
    </div>
  )
}
