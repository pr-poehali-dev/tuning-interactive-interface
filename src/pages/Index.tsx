import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import ClientDialog from '@/components/dialogs/ClientDialog';
import CarDialog from '@/components/dialogs/CarDialog';
import ServiceDialog from '@/components/dialogs/ServiceDialog';
import OrderDialog from '@/components/dialogs/OrderDialog';

const API_URL = 'https://functions.poehali.dev/b25b1563-bddf-443b-922f-0d5bf04194c0';

interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  orders: number;
  total: number;
}

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate?: string;
  owner?: string;
  orders: number;
  client_id?: number;
}

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  popular: boolean;
}

interface Order {
  id: string;
  client: string;
  car: string;
  status: string;
  total: number;
  date: string;
  notes?: string;
  client_id?: number;
  car_id?: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, carsRes, servicesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}?entity=clients`),
        fetch(`${API_URL}?entity=cars`),
        fetch(`${API_URL}?entity=services`),
        fetch(`${API_URL}?entity=orders`)
      ]);
      
      setClients(await clientsRes.json());
      setCars(await carsRes.json());
      setServices(await servicesRes.json());
      setOrders(await ordersRes.json());
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClient = async (client: any) => {
    try {
      const method = client.id ? 'PUT' : 'POST';
      await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'clients', ...client })
      });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения клиента:', error);
    }
  };

  const handleSaveCar = async (car: any) => {
    try {
      const method = car.id ? 'PUT' : 'POST';
      await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'cars', ...car })
      });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения автомобиля:', error);
    }
  };

  const handleSaveService = async (service: any) => {
    try {
      const method = service.id ? 'PUT' : 'POST';
      await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'services', ...service })
      });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения услуги:', error);
    }
  };

  const handleSaveOrder = async (order: any) => {
    try {
      const method = order.id ? 'PUT' : 'POST';
      await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'orders', ...order })
      });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения заказа:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'В работе': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Завершен': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Ожидание': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return <Badge className={`${variants[status]} border`}>{status}</Badge>;
  };

  const activeOrders = orders.filter(o => o.status === 'В работе').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Wrench" size={20} className="text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TunVik</h1>
            </div>
          </div>

          <nav className="space-y-1">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              Дашборд
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('orders')}
            >
              <Icon name="ClipboardList" size={18} className="mr-2" />
              Заказы
            </Button>
            <Button
              variant={activeTab === 'cars' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('cars')}
            >
              <Icon name="Car" size={18} className="mr-2" />
              Автомобили
            </Button>
            <Button
              variant={activeTab === 'clients' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('clients')}
            >
              <Icon name="Users" size={18} className="mr-2" />
              Клиенты
            </Button>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('services')}
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Услуги
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">
                  {activeTab === 'dashboard' && 'Панель управления'}
                  {activeTab === 'orders' && 'Заказы'}
                  {activeTab === 'cars' && 'Автомобили'}
                  {activeTab === 'clients' && 'Клиенты'}
                  {activeTab === 'services' && 'Услуги'}
                </h2>
                <p className="text-muted-foreground">
                  {activeTab === 'dashboard' && 'Обзор ключевых показателей'}
                  {activeTab === 'orders' && 'Управление заказами клиентов'}
                  {activeTab === 'cars' && 'База автомобилей в работе'}
                  {activeTab === 'clients' && 'База клиентов салона'}
                  {activeTab === 'services' && 'Каталог услуг тюнинга'}
                </p>
              </div>
              {activeTab !== 'dashboard' && (
                <div className="flex gap-3">
                  <Input
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={() => {
                    if (activeTab === 'clients') {
                      setEditingClient(null);
                      setIsClientDialogOpen(true);
                    } else if (activeTab === 'cars') {
                      setEditingCar(null);
                      setIsCarDialogOpen(true);
                    } else if (activeTab === 'services') {
                      setEditingService(null);
                      setIsServiceDialogOpen(true);
                    } else if (activeTab === 'orders') {
                      setEditingOrder(null);
                      setIsOrderDialogOpen(true);
                    }
                  }}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Активных заказов</CardTitle>
                            <Icon name="ClipboardList" size={20} className="text-primary" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-foreground">{activeOrders}</div>
                          <p className="text-xs text-muted-foreground mt-1">в работе</p>
                        </CardContent>
                      </Card>

                      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Выручка (всего)</CardTitle>
                            <Icon name="TrendingUp" size={20} className="text-primary" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-foreground">{(totalRevenue / 1000000).toFixed(1)}M ₽</div>
                          <p className="text-xs text-muted-foreground mt-1">все заказы</p>
                        </CardContent>
                      </Card>

                      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Клиентов</CardTitle>
                            <Icon name="Users" size={20} className="text-primary" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-foreground">{clients.length}</div>
                          <p className="text-xs text-muted-foreground mt-1">в базе данных</p>
                        </CardContent>
                      </Card>

                      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Автомобилей</CardTitle>
                            <Icon name="Car" size={20} className="text-primary" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-foreground">{cars.length}</div>
                          <p className="text-xs text-muted-foreground mt-1">в базе данных</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-border bg-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Последние заказы</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => (
                              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                                <div>
                                  <p className="font-medium text-foreground">{order.client}</p>
                                  <p className="text-sm text-muted-foreground">{order.car}</p>
                                </div>
                                <div className="text-right">
                                  {getStatusBadge(order.status)}
                                  <p className="text-sm text-muted-foreground mt-1">{order.total.toLocaleString()} ₽</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border bg-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Популярные услуги</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {services.filter(s => s.popular).slice(0, 5).map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                                <div>
                                  <p className="font-medium text-foreground">{service.name}</p>
                                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary">{service.price.toLocaleString()} ₽</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <Card className="border-border bg-card animate-fade-in">
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground">№</TableHead>
                            <TableHead className="text-muted-foreground">Клиент</TableHead>
                            <TableHead className="text-muted-foreground">Автомобиль</TableHead>
                            <TableHead className="text-muted-foreground">Статус</TableHead>
                            <TableHead className="text-muted-foreground">Сумма</TableHead>
                            <TableHead className="text-muted-foreground">Дата</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id} className="border-border hover:bg-secondary/50 transition-colors">
                              <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                              <TableCell className="text-foreground">{order.client}</TableCell>
                              <TableCell className="text-muted-foreground">{order.car}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell className="font-semibold text-foreground">{order.total.toLocaleString()} ₽</TableCell>
                              <TableCell className="text-muted-foreground">{order.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'cars' && (
                  <Card className="border-border bg-card animate-fade-in">
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground">Марка</TableHead>
                            <TableHead className="text-muted-foreground">Модель</TableHead>
                            <TableHead className="text-muted-foreground">Год</TableHead>
                            <TableHead className="text-muted-foreground">Номер</TableHead>
                            <TableHead className="text-muted-foreground">Владелец</TableHead>
                            <TableHead className="text-muted-foreground">Заказов</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cars.map((car) => (
                            <TableRow key={car.id} className="border-border hover:bg-secondary/50 transition-colors">
                              <TableCell className="font-medium text-foreground">{car.brand}</TableCell>
                              <TableCell className="text-foreground">{car.model}</TableCell>
                              <TableCell className="text-muted-foreground">{car.year}</TableCell>
                              <TableCell className="text-muted-foreground">{car.license_plate || '—'}</TableCell>
                              <TableCell className="text-muted-foreground">{car.owner}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-primary/30 text-primary">{car.orders}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'clients' && (
                  <Card className="border-border bg-card animate-fade-in">
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground">ФИО</TableHead>
                            <TableHead className="text-muted-foreground">Телефон</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-muted-foreground">Заказов</TableHead>
                            <TableHead className="text-muted-foreground">Всего потрачено</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clients.map((client) => (
                            <TableRow key={client.id} className="border-border hover:bg-secondary/50 transition-colors">
                              <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                              <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                              <TableCell className="text-muted-foreground">{client.email || '—'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-primary/30 text-primary">{client.orders}</Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-foreground">{client.total.toLocaleString()} ₽</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'services' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                    {services.map((service) => (
                      <Card key={service.id} className="border-border bg-card hover:bg-card/80 transition-all hover:scale-105">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            {service.popular && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">Популярная</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Icon name="Clock" size={16} className="mr-2" />
                              {service.duration}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">{service.price.toLocaleString()} ₽</span>
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingService(service);
                                setIsServiceDialogOpen(true);
                              }}>
                                <Icon name="Edit" size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <ClientDialog
        open={isClientDialogOpen}
        onClose={() => setIsClientDialogOpen(false)}
        onSave={handleSaveClient}
        client={editingClient}
      />

      <CarDialog
        open={isCarDialogOpen}
        onClose={() => setIsCarDialogOpen(false)}
        onSave={handleSaveCar}
        car={editingCar}
        clients={clients}
      />

      <ServiceDialog
        open={isServiceDialogOpen}
        onClose={() => setIsServiceDialogOpen(false)}
        onSave={handleSaveService}
        service={editingService}
      />

      <OrderDialog
        open={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        onSave={handleSaveOrder}
        order={editingOrder}
        clients={clients}
        cars={cars}
      />
    </div>
  );
};

export default Index;
