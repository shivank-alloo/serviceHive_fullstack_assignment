import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { Lead, LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/types/lead.types';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().email('Please enter a valid email'),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  source: z.enum(['website', 'instagram', 'referral']),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const isEditing = !!lead;
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? 'new',
      source: lead?.source ?? 'website',
    },
  });

  const onSubmit = (data: LeadFormData) => {
    if (isEditing) {
      updateLead({ id: lead._id, payload: data }, { onSuccess });
    } else {
      createLead(data, { onSuccess });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="e.g. rahul@example.com"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          required
          options={LEAD_STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Source"
          required
          options={LEAD_SOURCE_OPTIONS}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" isLoading={isPending}>
          {isEditing ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
