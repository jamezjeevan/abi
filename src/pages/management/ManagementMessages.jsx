import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementService } from '../../services/managementService';
import { messagingService } from '../../services/messagingService';
import { campusStore } from '../../services/campusStore';
import { ChatWindow } from '../../components/common/ChatWindow';
import { MessageSquare, Users, GraduationCap, ChevronRight } from 'lucide-react';

export const ManagementMessages = () => {
  const { profile, user } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [activeFaculty, setActiveFaculty] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const loadFaculty = async () => {
      const list = await managementService.getFacultyList();
      setFacultyList(list || []);
      if (list && list.length > 0) {
        selectFacultyForChat(list[0]);
      }
    };
    loadFaculty();
  }, []);

  const selectFacultyForChat = async (fac) => {
    setActiveFaculty(fac);
    // Find or create conversation
    const conv = await messagingService.startOrGetDirectConversation({
      userA: { id: user?.id || '22222222-2222-2222-2222-222222222222', name: profile?.full_name || 'Dean Vance', role: 'management' },
      userB: { id: fac.user_id, name: fac.name, role: 'faculty' },
      title: `Dean Office & ${fac.name}`
    });
    setCurrentConversation(conv);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Institutional Channel</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Communicate with Faculty
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Direct real-time messaging between College Management and Department Faculty mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Faculty List Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Select Faculty Member
          </div>
          {facultyList.map((fac) => {
            const isSelected = activeFaculty?.id === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => selectFacultyForChat(fac)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {fac.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs truncate">{fac.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{fac.department}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Real-time Chat Area */}
        <div className="md:col-span-2">
          <ChatWindow
            conversationId={currentConversation?.id}
            currentUserId={user?.id || '22222222-2222-2222-2222-222222222222'}
            currentUserName={profile?.full_name || 'Dean Dr. Arthur Vance'}
            title={activeFaculty ? `Chat with ${activeFaculty.name}` : 'Faculty Communication'}
            subtitle={activeFaculty ? `${activeFaculty.department} • ${activeFaculty.email}` : ''}
          />
        </div>
      </div>
    </div>
  );
};
