import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const LookupCU = ({ initialData, onSave, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: '',
      lookupTypeId: '',
      parentLookupId: '',
    },
  });

  React.useEffect(() => {
    reset(initialData || {
      name: '',
      lookupTypeId: '',
      parentLookupId: '',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4 p-2">
      <Input label="Name" {...register('name', { required: true })} />
      <Input label="Lookup Type ID" type="number" {...register('lookupTypeId', { required: true })} />
      <Input label="Parent Lookup ID" type="number" {...register('parentLookupId')} />
      <div className="flex gap-2 justify-end">
        <Button type="submit">Save</Button>
        <Button type="button" color="gray" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default LookupCU;
