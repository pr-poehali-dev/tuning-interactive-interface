import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Order {
  id?: number;
  client_id: number;
  car_id: number;
  status: string;
  total_amount: number;
  notes?: string;
}

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  order?: Order | null;
  clients: Array<{ id: number; name: string }>;
  cars: Array<{ id: number; brand: string; model: string }>;
}

const OrderDialog = ({ open, onClose, onSave, order, clients, cars }: OrderDialogProps) => {
  const [formData, setFormData] = useState<Order>({
    client_id: 0,
    car_id: 0,
    status: 'Ожидание',
    total_amount: 0,
    notes: ''
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      setFormData({
        client_id: clients[0]?.id || 0,
        car_id: cars[0]?.id || 0,
        status: 'Ожидание',
        total_amount: 0,
        notes: ''
      });
    }
  }, [order, open, clients, cars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{order ? 'Редактировать заказ' : 'Создать заказ'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Клиент *</Label>
              <Select
                value={formData.client_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, client_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="car">Автомобиль *</Label>
              <Select
                value={formData.car_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, car_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите автомобиль" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.brand} {car.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Статус *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ожидание">Ожидание</SelectItem>
                    <SelectItem value="В работе">В работе</SelectItem>
                    <SelectItem value="Завершен">Завершен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total">Сумма (₽) *</Label>
                <Input
                  id="total"
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                  placeholder="125000"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Дополнительная информация о заказе"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              {order ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
