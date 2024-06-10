// pages/mitra/product/[productId].tsx
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';

interface OpenTrip {
  open_trip_uuid: string;
  open_trip_name: string;
  description: string;
  price: number;
  min_people: number;
  max_people: number;
  include: string;
  exclude: string;
  gmaps: string;
  policy: string;
  mountain_data: Array<{ name: string }>;
}

const EditProduct = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<OpenTrip | null>(null);
  const [schedule, setSchedule] = useState({ day: 1, description: '' });
  const [faq, setFaq] = useState({ description: '' });

  useEffect(() => {
    if (productId) {
      axios.get(`https://highking.cloud/api/open-trips/${productId}`)
        .then(response => {
          setProduct(response.data.data[0]);
        })
        .catch(error => console.error('Failed to fetch product', error));
    }
  }, [productId]);

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleFaqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.post('https://highking.cloud/api/open-trips/schedules', { ...schedule, open_trip_uuid: productId });
      await axios.post('https://highking.cloud/api/open-trips/faqs', { ...faq, open_trip_uuid: productId });
      toast.success('Product details updated successfully!');
    } catch (error) {
      toast.error('Failed to update product details.');
      console.error('Failed to update product details', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <Toaster position="top-center" richColors />
      <h1>Edit Product</h1>
      <div>
        <h2>{product.open_trip_name}</h2>
        <p>{product.description}</p>
        <p>Price: {product.price}</p>
        <p>Min People: {product.min_people}</p>
        <p>Max People: {product.max_people}</p>
        <p>Includes: {product.include}</p>
        <p>Excludes: {product.exclude}</p>
        <p>Policy: {product.policy}</p>
        <p>Mountain: {product.mountain_data.map(mountain => mountain.name).join(', ')}</p>
      </div>
      <div>
        <Label htmlFor="day">Day</Label>
        <Input name="day" value={schedule.day} onChange={handleScheduleChange} />
        <Label htmlFor="description">Description</Label>
        <Input name="description" value={schedule.description} onChange={handleScheduleChange} />
      </div>
      <div>
        <Label htmlFor="faqDescription">FAQ Description</Label>
        <Input name="description" value={faq.description} onChange={handleFaqChange} />
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default EditProduct;
