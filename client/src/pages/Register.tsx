import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth, getApiError } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase and number'),
    confirmPassword: z.string(),
    role: z.enum(['admin', 'sales']),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  { value: 'sales', label: 'Sales User' },
  { value: 'admin', label: 'Admin' },
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  });

  const selectedRole = watch('role');

  const onSubmit = async ({ confirmPassword: _cp, ...data }: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to Smart Leads');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">SL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              id="register-name"
              label="Full Name"
              placeholder="Rahul Sharma"
              required
              error={errors.name?.message}
              leftElement={<User className="w-4 h-4" />}
              {...register('name')}
            />

            <Input
              id="register-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              leftElement={<Mail className="w-4 h-4" />}
              {...register('email')}
            />

            <Input
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, upper/lower/number"
              required
              error={errors.password?.message}
              leftElement={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Input
              id="register-confirm-password"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              required
              error={errors.confirmPassword?.message}
              leftElement={<Lock className="w-4 h-4" />}
              {...register('confirmPassword')}
            />

            <Select
              id="register-role"
              label="Role"
              required
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              leftElement={<ShieldCheck className="w-4 h-4" />}
              {...register('role')}
            />

            {selectedRole === 'admin' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Admin role</strong>: Full access including deleting leads and viewing all users.
                </p>
              </div>
            )}

            <Button
              id="register-submit-btn"
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
