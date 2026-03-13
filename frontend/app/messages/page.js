"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { io } from 'socket.io-client';
import { encryptMessage, decryptMessage } from '@/utils/encryption';
import { Send, User, MapPin, Loader2, ArrowLeft, Reply, X, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ScheduleVisitModal from '@/components/ScheduleVisitModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const SOCKET_URL = API_BASE.replace('/api/v1', '');
const BACKEND_BASE = API_BASE.replace('/api/v1', '');

export default function MessagesPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [replyToMsg, setReplyToMsg] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedMeetingData, setSelectedMeetingData] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Hydrate user
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            setUserId(user.id || user._id);
        } catch (e) {
            console.error('Failed to parse user', e);
        }

        // Initialize Socket
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, [router]);

    useEffect(() => {
        if (!userId) return;
        fetchConversations();
    }, [userId]);

    useEffect(() => {
        if (socket && activeConversation) {
            socket.emit('join_conversation', activeConversation._id);

            const handleReceiveMessage = (message) => {
                if (message.conversationId === activeConversation._id) {
                    setMessages((prev) => {
                        // If it's a new meeting request or status update, supersede old ones locally
                        let updated = prev;
                        if (message.type === 'meeting_request' || message.type === 'meeting_confirmed') {
                            updated = prev.map(msg => {
                                if (msg.type === 'meeting_request' && msg.metadata?.meetingId === message.metadata?.meetingId) {
                                    return { ...msg, metadata: { ...msg.metadata, action: message.type === 'meeting_confirmed' ? 'confirmed' : 'superseded' } };
                                }
                                return msg;
                            });
                        }
                        return [...updated, message];
                    });
                } else {
                    // Update latest message in conversation list
                    setConversations(prev => prev.map(conv => {
                        if (conv._id === message.conversationId) {
                            return { ...conv, lastMessage: message.encryptedMessage, updatedAt: message.createdAt };
                        }
                        return conv;
                    }).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
                }
            };

            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [socket, activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE}/chat/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setConversations(data.data);
                // Auto select if coming from property page
                const urlParams = new URLSearchParams(window.location.search);
                const convId = urlParams.get('conversation');
                if (convId) {
                    const active = data.data.find(c => c._id === convId);
                    if (active) selectConversation(active);
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectConversation = async (conversation) => {
        setActiveConversation(conversation);

        // Optimistically clear unread count for this conversation in the sidebar
        setConversations(prev => prev.map(conv => {
            if (conv._id === conversation._id) {
                const meParticipant = conv.participants?.find(p => p.id === userId || p._id === userId);
                const myObjectId = meParticipant?._id || userId;
                return {
                    ...conv,
                    unreadCounts: { ...conv.unreadCounts, [myObjectId]: 0, [userId]: 0 }
                };
            }
            return conv;
        }));

        try {
            const token = localStorage.getItem('accessToken');
            
            fetch(`${API_BASE}/chat/conversations/${conversation._id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(e => console.error('Failed to mark read', e));

            const res = await fetch(`${API_BASE}/chat/messages/${conversation._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleConfirmMeeting = async (meetingId) => {
        if (!meetingId) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE}/meetings/${meetingId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'confirmed' })
            });
            const data = await res.json();
            if (data.success) {
                // Instantly update the local UI to hide the buttons
                setMessages(prev => prev.map(msg => {
                    if (msg.metadata?.meetingId === meetingId && msg.metadata?.action !== 'superseded') {
                        return { ...msg, metadata: { ...msg.metadata, action: 'confirmed' } };
                    }
                    return msg;
                }));
            }
        } catch (error) {
            console.error('Failed to confirm meeting', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || !socket) return;

        const otherParticipant = activeConversation.participants.find(p => p.id !== userId && p._id !== userId);
        const receiverId = otherParticipant ? (otherParticipant.id || otherParticipant._id) : null;

        const encrypted = encryptMessage(newMessage, activeConversation._id);

        const messageData = {
            conversationId: activeConversation._id,
            senderId: userId,
            receiverId,
            propertyId: activeConversation.propertyId?._id,
            encryptedMessage: encrypted,
            replyTo: replyToMsg ? replyToMsg._id : null,
            createdAt: new Date().toISOString()
        };

        // Emit via socket
        socket.emit('send_message', messageData);

        // Optimistic UI updates
        // We will also receive our own message back broadcasted by socket.io to the room
        // But to avoid duplicate, we can rely on receive_message event, OR update UI directly.
        // Actually, we are joining the room, so socket.io broadcasts to 'room'.
        // Wait, socket.io .to() sends to everyone except sender usually unless configured or we use IO instance vs Socket instance.
        // In our backend we used `io.to(conversationId).emit(...)` which sends to everyone including sender!
        // So we don't need optimistic update, we will get it via socket!
        
        // Wait, we can clear the input right away
        setNewMessage('');
        setReplyToMsg(null);
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p.id !== userId && p._id !== userId) || conversation.participants[0];
    };

    if (loading) {
        return (
            <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
                <div className="shrink-0">
                    <Header />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-50 flex flex-col font-sans">
            <div className="shrink-0">
                <Header />
            </div>
            <div className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6">
                
                {/* Conversations Sidebar */}
                <div className={`w-full md:w-1/3 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-100 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-slate-500">
                                <p>No conversations yet.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const otherUser = getOtherParticipant(conv);
                                const isActive = activeConversation?._id === conv._id;
                                const lastMsgDecrypted = conv.lastMessage ? decryptMessage(conv.lastMessage, conv._id) : '';
                                const meParticipant = conv.participants?.find(p => p.id === userId || p._id === userId);
                                const unreadCount = (meParticipant?._id && conv.unreadCounts?.[meParticipant._id]) || conv.unreadCounts?.[userId] || 0;

                                return (
                                    <div 
                                        key={conv._id}
                                        onClick={() => selectConversation(conv)}
                                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${isActive ? 'bg-indigo-50/50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 relative">
                                                {otherUser?.avatar ? (
                                                    <img src={`${BACKEND_BASE}${otherUser.avatar}`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                                ) : <User size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className={`text-sm font-bold truncate ${unreadCount > 0 ? 'text-indigo-900' : 'text-slate-900'}`}>
                                                        {otherUser?.fullName || 'User'}
                                                    </h3>
                                                    {conv.updatedAt && (
                                                        <span className={`text-xs shrink-0 ${unreadCount > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                                                            {new Date(conv.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-indigo-600 font-medium truncate mb-1">
                                                    {conv.propertyId?.title}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-xs truncate ${unreadCount > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                                                        {lastMsgDecrypted || 'No messages yet'}
                                                    </p>
                                                    {unreadCount > 0 && (
                                                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 shrink-0">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );

                            })
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`w-full md:w-2/3 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
                                <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full" onClick={() => setActiveConversation(null)}>
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {getOtherParticipant(activeConversation)?.fullName || 'User'}
                                        </h3>
                                        {activeConversation.propertyId && (
                                            <Link href={`/properties/${activeConversation.propertyId.id || activeConversation.propertyId._id}`} className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                                                <MapPin size={12} /> {activeConversation.propertyId.title}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {messages.map((msg, idx) => {
                                    if (msg.type === 'meeting_confirmed') return null;

                                    const meParticipant = activeConversation.participants.find(p => p.id === userId || p._id === userId);
                                    const myObjectId = meParticipant?._id;
                                    const isMe = msg.senderId === myObjectId;
                                    const decrypted = decryptMessage(msg.encryptedMessage, activeConversation._id);
                                    let repliedToDecrypted = '';
                                    
                                    if (msg.replyTo) {
                                        const repliedMsg = messages.find(m => m._id === msg.replyTo);
                                        if (repliedMsg) {
                                            repliedToDecrypted = decryptMessage(repliedMsg.encryptedMessage, activeConversation._id);
                                        }
                                    }
                                    
                                    const isMeetingMsg = msg.type === 'meeting_request' || msg.type === 'meeting_confirmed';
                                    
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                                            {!isMe && (
                                                <button 
                                                    onClick={() => setReplyToMsg(msg)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600 mr-2 self-center rounded-full hover:bg-slate-100"
                                                    title="Reply"
                                                >
                                                    <Reply size={16} />
                                                </button>
                                            )}
                                            
                                            {isMeetingMsg ? (
                                                <div className={`w-full max-w-sm rounded-xl overflow-hidden shadow-sm border ${isMe ? 'border-indigo-200 bg-white' : 'border-slate-200 bg-white'} text-slate-800 flex flex-col`}>
                                                    <div className={`px-4 py-3 flex items-center gap-2 font-bold ${isMe ? 'bg-indigo-50 text-indigo-700 border-b border-indigo-100' : 'bg-slate-50 text-slate-700 border-b border-slate-100'}`}>
                                                        <Calendar size={18} className={isMe ? 'text-indigo-500' : 'text-slate-500'} /> 
                                                        {msg.type === 'meeting_request' ? 'Meeting Request' : 'Meeting Confirmed'}
                                                    </div>
                                                    <div className="p-4 flex flex-col gap-3">
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{decrypted}</p>
                                                        
                                                        {msg.metadata?.message && (
                                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                                                                <span className="font-semibold text-slate-900 mb-1 block">Note:</span>
                                                                {msg.metadata.message}
                                                            </div>
                                                        )}

                                                        {msg.type === 'meeting_request' && msg.metadata?.action !== 'confirmed' && msg.metadata?.action !== 'superseded' && !isMe && (
                                                            <div className="flex gap-2 mt-2 pt-2">
                                                                <button
                                                                    onClick={() => handleConfirmMeeting(msg.metadata?.meetingId)}
                                                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedMeetingData({
                                                                            preferredDate: msg.metadata?.preferredDate || '',
                                                                            preferredTime: msg.metadata?.preferredTime || '',
                                                                            message: '',
                                                                            metadata: msg.metadata
                                                                        });
                                                                        setShowRescheduleModal(true);
                                                                    }}
                                                                    className="flex-1 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-lg shadow-sm transition-colors"
                                                                >
                                                                    Reschedule
                                                                </button>
                                                            </div>
                                                        )}

                                                        {msg.type === 'meeting_request' && msg.metadata?.action === 'confirmed' && (
                                                            <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50 rounded-xl py-2">
                                                                <CheckCircle size={18} /> Meeting Confirmed
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={`px-4 py-2 text-[10px] text-right ${isMe ? 'bg-indigo-50/50 text-indigo-400' : 'bg-slate-50/50 text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                                    {repliedToDecrypted && (
                                                        <div className={`text-[11px] p-2 mb-2 rounded border-l-2 bg-black/10 truncate ${isMe ? 'border-white text-indigo-100' : 'border-indigo-500 text-slate-500'}`}>
                                                            {repliedToDecrypted}
                                                        </div>
                                                    )}
                                                    <p className="whitespace-pre-wrap">{decrypted}</p>
                                                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            )}


                                            {isMe && (
                                                <button 
                                                    onClick={() => setReplyToMsg(msg)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600 ml-2 self-center rounded-full hover:bg-slate-100"
                                                    title="Reply"
                                                >
                                                    <Reply size={16} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl relative shrink-0">
                                {replyToMsg && (
                                    <div className="absolute top-[-40px] left-0 right-0 bg-slate-100 px-4 py-2 text-xs flex justify-between items-center text-slate-600 border-t border-slate-200">
                                        <div className="flex items-center gap-2 truncate">
                                            <Reply size={14} className="text-indigo-500" />
                                            <span className="font-semibold text-slate-800">Replying to:</span>
                                            <span className="truncate max-w-[200px] md:max-w-md">
                                                {decryptMessage(replyToMsg.encryptedMessage, activeConversation._id)}
                                            </span>
                                        </div>
                                        <button onClick={() => setReplyToMsg(null)} className="text-slate-400 hover:text-slate-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleSendMessage} className="flex gap-2 relative z-10">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type an encrypted message..."
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                <Send size={32} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-medium">Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
            
            {showRescheduleModal && activeConversation?.propertyId && (
                <ScheduleVisitModal
                    propertyId={activeConversation.propertyId.id || activeConversation.propertyId._id}
                    propertyTitle={activeConversation.propertyId.title}
                    existingMeeting={selectedMeetingData}
                    onClose={() => {
                        setShowRescheduleModal(false);
                        setSelectedMeetingData(null);
                    }}
                />
            )}
        </div>
    );
}
