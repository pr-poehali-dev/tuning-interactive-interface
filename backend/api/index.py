import json
import os
import psycopg2
from typing import Dict, Any, List, Optional
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления данными TunVik (клиенты, автомобили, заказы, услуги)
    GET /clients - получить всех клиентов
    GET /cars - получить все автомобили
    GET /orders - получить все заказы
    GET /services - получить все услуги
    POST /clients - создать клиента
    POST /cars - создать автомобиль
    POST /orders - создать заказ
    POST /services - создать услугу
    PUT /clients/:id - обновить клиента
    PUT /cars/:id - обновить автомобиль
    PUT /orders/:id - обновить заказ
    PUT /services/:id - обновить услугу
    '''
    
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('path', '/')
    params = event.get('queryStringParameters') or {}
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            entity = params.get('entity', 'clients')
            
            if entity == 'clients':
                cur.execute('''
                    SELECT c.id, c.name, c.phone, c.email, 
                           COUNT(DISTINCT o.id) as orders_count,
                           COALESCE(SUM(o.total_amount), 0) as total_spent
                    FROM clients c
                    LEFT JOIN orders o ON c.id = o.client_id
                    GROUP BY c.id, c.name, c.phone, c.email
                    ORDER BY c.id DESC
                ''')
                rows = cur.fetchall()
                result = [{
                    'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
                    'orders': r[4], 'total': float(r[5])
                } for r in rows]
                
            elif entity == 'cars':
                cur.execute('''
                    SELECT c.id, c.brand, c.model, c.year, c.license_plate,
                           cl.name as owner, COUNT(DISTINCT o.id) as orders_count
                    FROM cars c
                    LEFT JOIN clients cl ON c.client_id = cl.id
                    LEFT JOIN orders o ON c.id = o.car_id
                    GROUP BY c.id, c.brand, c.model, c.year, c.license_plate, cl.name
                    ORDER BY c.id DESC
                ''')
                rows = cur.fetchall()
                result = [{
                    'id': r[0], 'brand': r[1], 'model': r[2], 'year': r[3],
                    'license_plate': r[4], 'owner': r[5], 'orders': r[6]
                } for r in rows]
                
            elif entity == 'orders':
                cur.execute('''
                    SELECT o.id, cl.name as client, c.brand || '' '' || c.model as car,
                           o.status, o.total_amount, 
                           TO_CHAR(o.created_at, ''DD.MM.YYYY'') as date,
                           o.notes
                    FROM orders o
                    JOIN clients cl ON o.client_id = cl.id
                    JOIN cars c ON o.car_id = c.id
                    ORDER BY o.id DESC
                ''')
                rows = cur.fetchall()
                result = [{
                    'id': str(r[0]).zfill(3), 'client': r[1], 'car': r[2],
                    'status': r[3], 'total': float(r[4]), 'date': r[5], 'notes': r[6]
                } for r in rows]
                
            elif entity == 'services':
                cur.execute('''
                    SELECT id, name, description, price, duration, is_popular
                    FROM services
                    ORDER BY is_popular DESC, id
                ''')
                rows = cur.fetchall()
                result = [{
                    'id': r[0], 'name': r[1], 'description': r[2],
                    'price': float(r[3]), 'duration': r[4], 'popular': r[5]
                } for r in rows]
            
            else:
                result = {'error': 'Unknown entity'}
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            entity = body.get('entity')
            
            if entity == 'clients':
                cur.execute(
                    'INSERT INTO clients (name, phone, email) VALUES (%s, %s, %s) RETURNING id',
                    (body['name'], body['phone'], body.get('email'))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                result = {'id': new_id, 'message': 'Клиент создан'}
                
            elif entity == 'cars':
                cur.execute(
                    '''INSERT INTO cars (brand, model, year, license_plate, vin, client_id) 
                       VALUES (%s, %s, %s, %s, %s, %s) RETURNING id''',
                    (body['brand'], body['model'], body['year'], 
                     body.get('license_plate'), body.get('vin'), body['client_id'])
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                result = {'id': new_id, 'message': 'Автомобиль добавлен'}
                
            elif entity == 'orders':
                cur.execute(
                    '''INSERT INTO orders (client_id, car_id, status, total_amount, notes) 
                       VALUES (%s, %s, %s, %s, %s) RETURNING id''',
                    (body['client_id'], body['car_id'], body.get('status', 'Ожидание'),
                     body.get('total_amount', 0), body.get('notes'))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                result = {'id': new_id, 'message': 'Заказ создан'}
                
            elif entity == 'services':
                cur.execute(
                    '''INSERT INTO services (name, description, price, duration, is_popular) 
                       VALUES (%s, %s, %s, %s, %s) RETURNING id''',
                    (body['name'], body.get('description'), body['price'],
                     body.get('duration'), body.get('is_popular', False))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                result = {'id': new_id, 'message': 'Услуга создана'}
            
            else:
                result = {'error': 'Unknown entity'}
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            entity = body.get('entity')
            entity_id = body.get('id')
            
            if entity == 'clients':
                cur.execute(
                    'UPDATE clients SET name=%s, phone=%s, email=%s WHERE id=%s',
                    (body['name'], body['phone'], body.get('email'), entity_id)
                )
                
            elif entity == 'cars':
                cur.execute(
                    '''UPDATE cars SET brand=%s, model=%s, year=%s, 
                       license_plate=%s, vin=%s, client_id=%s WHERE id=%s''',
                    (body['brand'], body['model'], body['year'],
                     body.get('license_plate'), body.get('vin'), 
                     body['client_id'], entity_id)
                )
                
            elif entity == 'orders':
                cur.execute(
                    '''UPDATE orders SET client_id=%s, car_id=%s, status=%s, 
                       total_amount=%s, notes=%s WHERE id=%s''',
                    (body['client_id'], body['car_id'], body['status'],
                     body['total_amount'], body.get('notes'), entity_id)
                )
                
            elif entity == 'services':
                cur.execute(
                    '''UPDATE services SET name=%s, description=%s, price=%s, 
                       duration=%s, is_popular=%s WHERE id=%s''',
                    (body['name'], body.get('description'), body['price'],
                     body.get('duration'), body.get('is_popular', False), entity_id)
                )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Обновлено'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
