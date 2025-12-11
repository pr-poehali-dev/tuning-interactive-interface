import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

const mockOrders = [
  { id: '001', client: 'Иванов А.П.', car: 'BMW M3', status: 'В работе', total: 125000, date: '10.12.2024' },
  { id: '002', client: 'Петров С.М.', car: 'Mercedes C63', status: 'Завершен', total: 89000, date: '08.12.2024' },
  { id: '003', client: 'Сидорова М.И.', car: 'Audi RS6', status: 'Ожидание', total: 156000, date: '11.12.2024' },
  { id: '004', client: 'Козлов В.Н.', car: 'Porsche 911', status: 'В работе', total: 210000, date: '09.12.2024' },
];

const mockCars = [
  { id: 1, brand: 'BMW', model: 'M3', year: 2022, owner: 'Иванов А.П.', orders: 3 },
  { id: 2, brand: 'Mercedes', model: 'C63 AMG', year: 2021, owner: 'Петров С.М.', orders: 2 },
  { id: 3, brand: 'Audi', model: 'RS6', year: 2023, owner: 'Сидорова М.И.', orders: 1 },
  { id: 4, brand: 'Porsche', model: '911 Turbo', year: 2022, owner: 'Козлов В.Н.', orders: 4 },
];

const mockServices = [
  { id: 1, name: 'Чип-тюнинг Stage 1', price: 35000, duration: '2-3 дня', popular: true },
  { id: 2, name: 'Установка выхлопной системы', price: 85000, duration: '1 день', popular: true },
  { id: 3, name: 'Тонировка стекол', price: 12000, duration: '3-4 часа', popular: false },
  { id: 4, name: 'Полировка кузова', price: 18000, duration: '1 день', popular: false },
];

const mockClients = [
  { id: 1, name: 'Иванов Александр Петрович', phone: '+7 (915) 234-56-78', orders: 3, total: 245000 },
  { id: 2, name: 'Петров Сергей Михайлович', phone: '+7 (916) 345-67-89', orders: 2, total: 156000 },
  { id: 3, name: 'Сидорова Марина Игоревна', phone: '+7 (917) 456-78-90', orders: 1, total: 156000 },
  { id: 4, name: 'Козлов Владимир Николаевич', phone: '+7 (918) 567-89-01', orders: 4, total: 389000 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      'В работе': { variant: 'default', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'Завершен': { variant: 'secondary', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'Ожидание': { variant: 'outline', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    };
    return <Badge className={`${variants[status]?.color} border`}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Wrench" size={20} className="text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TuningPro</h1>
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
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить
                  </Button>
                </div>
              )}
            </div>

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
                      <div className="text-3xl font-bold text-foreground">8</div>
                      <p className="text-xs text-muted-foreground mt-1">+2 за неделю</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Выручка (месяц)</CardTitle>
                        <Icon name="TrendingUp" size={20} className="text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">2.4M ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">+12% к пред. месяцу</p>
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
                      <div className="text-3xl font-bold text-foreground">124</div>
                      <p className="text-xs text-muted-foreground mt-1">+8 новых</p>
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
                      <div className="text-3xl font-bold text-foreground">42</div>
                      <p className="text-xs text-muted-foreground mt-1">В базе данных</p>
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
                        {mockOrders.slice(0, 3).map((order) => (
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
                        {mockServices.filter(s => s.popular).map((service) => (
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
                        <TableHead className="text-muted-foreground">№ Заказа</TableHead>
                        <TableHead className="text-muted-foreground">Клиент</TableHead>
                        <TableHead className="text-muted-foreground">Автомобиль</TableHead>
                        <TableHead className="text-muted-foreground">Статус</TableHead>
                        <TableHead className="text-muted-foreground">Сумма</TableHead>
                        <TableHead className="text-muted-foreground">Дата</TableHead>
                        <TableHead className="text-muted-foreground text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id} className="border-border hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                          <TableCell className="text-foreground">{order.client}</TableCell>
                          <TableCell className="text-muted-foreground">{order.car}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="font-semibold text-foreground">{order.total.toLocaleString()} ₽</TableCell>
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Icon name="Eye" size={16} />
                            </Button>
                          </TableCell>
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
                        <TableHead className="text-muted-foreground">Владелец</TableHead>
                        <TableHead className="text-muted-foreground">Заказов</TableHead>
                        <TableHead className="text-muted-foreground text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCars.map((car) => (
                        <TableRow key={car.id} className="border-border hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium text-foreground">{car.brand}</TableCell>
                          <TableCell className="text-foreground">{car.model}</TableCell>
                          <TableCell className="text-muted-foreground">{car.year}</TableCell>
                          <TableCell className="text-muted-foreground">{car.owner}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/30 text-primary">{car.orders}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Icon name="Eye" size={16} />
                            </Button>
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
                        <TableHead className="text-muted-foreground">Заказов</TableHead>
                        <TableHead className="text-muted-foreground">Всего потрачено</TableHead>
                        <TableHead className="text-muted-foreground text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockClients.map((client) => (
                        <TableRow key={client.id} className="border-border hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                          <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/30 text-primary">{client.orders}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">{client.total.toLocaleString()} ₽</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Icon name="Eye" size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {mockServices.map((service) => (
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
                          <Button size="sm" variant="outline">
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
