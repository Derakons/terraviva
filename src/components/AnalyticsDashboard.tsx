/**
 * AnalyticsDashboard - Panel de estadísticas en tiempo real
 * Conectado a Supabase para métricas reales del negocio
 */

import React, { useEffect, useState } from 'react';
import {
    BarChart3, Users, Eye, TrendingUp, MessageSquare, Calendar, Mail, Phone,
    RefreshCw, AlertCircle, Building2, CheckCircle, Clock, DollarSign,
    MessageCircle, Bell, Inbox
} from 'lucide-react';
import { getDashboardStats, DashboardStats, isSupabaseConfigured, fetchContacts, Contact } from '../services/supabase';
import { Project } from '../types';

interface AnalyticsDashboardProps {
    projects: Project[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ projects }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStats = async () => {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
            setError('Base de datos no configurada. Configura Supabase para ver estadísticas.');
            setLoading(false);
            return;
        }

        const data = await getDashboardStats();
        const contactsData = await fetchContacts();
        
        if (data) {
            setStats(data);
            setContacts(contactsData);
        } else {
            setError('Error al cargar estadísticas');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Tarjeta de estadística con gradiente
    const StatCard = ({ icon: Icon, label, value, color, subtext, trend }: {
        icon: any;
        label: string;
        value: string | number;
        color: string;
        subtext?: string;
        trend?: { value: number; positive: boolean };
    }) => (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
                        {trend && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {trend.positive ? '↑' : '↓'} {trend.value}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </div>
    );

    // Mini tarjeta para métricas secundarias
    const MiniStatCard = ({ icon: Icon, label, value, color }: {
        icon: any;
        label: string;
        value: number;
        color: string;
    }) => (
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors">
            <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon size={18} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Cargando estadísticas...</p>
                    <p className="text-gray-400 text-sm">Conectando a Supabase</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-bold text-amber-800 mb-2">Dashboard No Disponible</h3>
                <p className="text-amber-600 mb-6">{error}</p>
                <div className="bg-white rounded-xl p-6 max-w-lg mx-auto text-left">
                    <p className="font-bold text-gray-700 mb-3">🚀 Para activar el Dashboard:</p>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                        <li>Crea una cuenta en <a href="https://supabase.com" className="text-blue-600 underline font-medium" target="_blank" rel="noreferrer">supabase.com</a></li>
                        <li>Crea un nuevo proyecto PostgreSQL</li>
                        <li>Ve a SQL Editor y ejecuta <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">database/setup.sql</code></li>
                        <li>Copia las credenciales a las variables de entorno</li>
                    </ol>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                        <p className="font-bold text-blue-800 mb-1">Variables necesarias:</p>
                        <code className="text-blue-700 text-xs">
                            VITE_SUPABASE_URL<br/>
                            VITE_SUPABASE_ANON_KEY
                        </code>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    // Calcular estadísticas adicionales
    const unreadContacts = contacts.filter(c => !c.isRead).length;
    const convertedContacts = contacts.filter(c => c.isConverted).length;
    const projectsForSale = projects.filter(p => p.status === 'En Venta').length;
    const projectsForRent = projects.filter(p => p.status === 'En Alquiler' || p.status === 'Alquiler Temporal').length;
    const projectsSold = projects.filter(p => p.status === 'Vendido').length;

    return (
        <div className="space-y-6">
            {/* Header con refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard en Tiempo Real</h2>
                    <p className="text-gray-500 text-sm">Estadísticas de tu negocio inmobiliario</p>
                </div>
                <button
                    onClick={loadStats}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                    <RefreshCw size={16} />
                    Actualizar Datos
                </button>
            </div>

            {/* Alerta de contactos no leídos */}
            {unreadContacts > 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <div>
                            <p className="font-bold">¡Tienes {unreadContacts} contacto{unreadContacts > 1 ? 's' : ''} sin leer!</p>
                            <p className="text-white/80 text-sm">Revisa los nuevos leads en la sección de contactos</p>
                        </div>
                    </div>
                    <span className="bg-white text-orange-600 font-bold px-3 py-1 rounded-full text-sm">
                        {unreadContacts} nuevo{unreadContacts > 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Stats Grid Principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Eye}
                    label="Visitas Totales"
                    value={stats.totalViews.toLocaleString()}
                    color="from-blue-500 to-blue-600"
                    subtext="Páginas vistas"
                />
                <StatCard
                    icon={Users}
                    label="Leads Generados"
                    value={stats.totalContacts}
                    color="from-green-500 to-emerald-600"
                    subtext={`${unreadContacts} sin leer`}
                />
                <StatCard
                    icon={Building2}
                    label="Propiedades Activas"
                    value={stats.totalProjects}
                    color="from-purple-500 to-indigo-600"
                    subtext={`${projectsForSale} en venta`}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Tasa de Conversión"
                    value={`${stats.conversionRate.toFixed(1)}%`}
                    color="from-orange-500 to-red-500"
                    subtext="Leads / Visitas"
                />
            </div>

            {/* Métricas secundarias */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-purple-500" />
                    Estado de Propiedades
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <MiniStatCard icon={DollarSign} label="En Venta" value={projectsForSale} color="bg-emerald-500" />
                    <MiniStatCard icon={Clock} label="En Alquiler" value={projectsForRent} color="bg-blue-500" />
                    <MiniStatCard icon={CheckCircle} label="Vendidos" value={projectsSold} color="bg-gray-500" />
                    <MiniStatCard icon={MessageCircle} label="Leads Convertidos" value={convertedContacts} color="bg-amber-500" />
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vistas por día */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-500" />
                        Visitas Últimos 7 Días
                    </h3>
                    <div className="h-52 flex items-end justify-between gap-2 pt-4">
                        {stats.dailyViews.length > 0 ? (
                            stats.dailyViews.map((day, i) => {
                                const maxViews = Math.max(...stats.dailyViews.map(d => d.count), 1);
                                const height = (day.count / maxViews) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group">
                                        <span className="text-xs text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{day.count}</span>
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer relative"
                                            style={{ height: `${Math.max(height, 8)}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {day.count} visitas
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 font-medium">
                                            {new Date(day.date).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full text-center py-12">
                                <Eye size={32} className="text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Sin visitas registradas</p>
                                <p className="text-gray-300 text-xs">Los datos aparecerán cuando los usuarios visiten el sitio</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Proyectos más vistos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 size={20} className="text-purple-500" />
                        Propiedades Más Vistas
                    </h3>
                    <div className="space-y-4">
                        {stats.projectViews.length > 0 ? (
                            stats.projectViews.slice(0, 5).map((pv, i) => {
                                const maxViews = stats.projectViews[0]?.views || 1;
                                const width = (pv.views / maxViews) * 100;
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-medium text-gray-700 truncate max-w-[200px] group-hover:text-purple-700 transition-colors">
                                                {i + 1}. {pv.title}
                                            </span>
                                            <span className="text-gray-500 font-bold">{pv.views}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full transition-all group-hover:from-purple-700"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <Building2 size={32} className="text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Sin vistas a propiedades aún</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Últimos Contactos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Inbox size={20} className="text-green-500" />
                        Últimos Contactos Recibidos
                    </h3>
                    {stats.totalContacts > 0 && (
                        <span className="text-sm text-gray-500">
                            Total: <span className="font-bold text-gray-700">{stats.totalContacts}</span>
                        </span>
                    )}
                </div>

                {stats.recentContacts.length > 0 ? (
                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                                    <th className="px-6 py-3 font-semibold">Estado</th>
                                    <th className="px-6 py-3 font-semibold">Nombre</th>
                                    <th className="px-6 py-3 font-semibold">Contacto</th>
                                    <th className="px-6 py-3 font-semibold">Interés</th>
                                    <th className="px-6 py-3 font-semibold">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentContacts.slice(0, 8).map((contact, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {!contact.isRead ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                                    <Bell size={12} /> Nuevo
                                                </span>
                                            ) : contact.isConverted ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    <CheckCircle size={12} /> Convertido
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    <Eye size={12} /> Leído
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-800">{contact.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {contact.email && (
                                                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                                                        <Mail size={12} />
                                                        {contact.email}
                                                    </a>
                                                )}
                                                {contact.phone && (
                                                    <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-green-600 flex items-center gap-1 text-sm">
                                                        <Phone size={12} />
                                                        {contact.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600 text-sm">
                                                {contact.interest || contact.projectTitle || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Calendar size={12} />
                                                {new Date(contact.createdAt).toLocaleDateString('es-PE', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No hay contactos registrados aún</p>
                        <p className="text-gray-300 text-sm">Los leads aparecerán aquí cuando los usuarios te contacten</p>
                    </div>
                )}
            </div>

            {/* Footer con timestamp */}
            <div className="text-center text-gray-400 text-xs">
                Última actualización: {new Date().toLocaleString('es-PE')}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
