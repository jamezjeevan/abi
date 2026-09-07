import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import { managementService } from '../../services/managementService';
import { messagingService } from '../../services/messagingService';
import { campusStore } from '../../services/campusStore';
import { ChatWindow } from '../../components/common/ChatWindow';
import { MessageSquare, Users, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';

export const FacultyMessages = () => {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'faculty'
  const [students, setStudents] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const loadRecipients = async () => {
      const myStudents = await facultyService.getMyStudents(user?.id || '33333333-3333-3333-3333-333333333333');
      setStudents(myStudents || []);

      const allFaculty = await managementService.getFacultyList();
      setFacultyList(allFaculty.filter(f => f.user_id !== user?.id));

      if (myStudents && myStudents.length > 0) {
        selectStudentForChat(myStudents[0]);
      }
    };
    loadRecipients();
  }, [user]);

  const selectStudentForChat = async (student) => {
    setActiveRecipient({ ...student, type: 'student' });
    const conv = await messagingService.startOrGetDirectConversation({
      userA: { id: user?.id || '33333333-3333-3333-3333-333333333333', name: profile?.full_name || 'Prof. Sarah Jenkins', role: 'faculty' },
      userB: { id: student.user_id, name: student.name, role: 'student' },
      title: `${profile?.full_name || 'Faculty'} & ${student.name} Mentoring`
    });
    setCurrentConversation(conv);
  };

  const selectFacultyForChat = async (fac) => {
    setActiveRecipient({ ...fac, type: 'faculty' });
    const conv = await messagingService.startOrGetDirectConversation({
      userA: { id: user?.id || '33333333-3333-3333-3333-333333333333', name: profile?.full_name || 'Prof. Sarah Jenkins', role: 'faculty' },
      userB: { id: fac.user_id, name: fac.name, role: 'faculty' },
      title: `Peer Discussion: ${profile?.full_name} & ${fac.name}`
    });
    setCurrentConversation(conv);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Faculty Communication Hub</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Mentee & Colleague Messaging
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Direct real-time conversations with your assigned mentee students and academic faculty peers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipient Selector Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'students' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mentees ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'faculty' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Colleagues ({facultyList.length})
            </button>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {activeTab === 'students' ? (
              students.map((stu) => {
                const isSelected = activeRecipient?.id === stu.id && activeRecipient?.type === 'student';
                return (
                  <button
                    key={stu.id}
                    onClick={() => selectStudentForChat(stu)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {stu.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs truncate">{stu.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{stu.register_number}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </button>
                );
              })
            ) : (
              facultyList.map((fac) => {
                const isSelected = activeRecipient?.id === fac.id && activeRecipient?.type === 'faculty';
                return (
                  <button
                    key={fac.id}
                    onClick={() => selectFacultyForChat(fac)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
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
              })
            )}
          </div>
        </div>

        {/* Real-time Chat Area */}
        <div className="md:col-span-2">
          <ChatWindow
            conversationId={currentConversation?.id}
            currentUserId={user?.id || '33333333-3333-3333-3333-333333333333'}
            currentUserName={profile?.full_name || 'Prof. Sarah Jenkins'}
            title={activeRecipient ? `Chat with ${activeRecipient.name}` : 'Communication'}
            subtitle={activeRecipient ? `${activeRecipient.type === 'student' ? 'Mentee Student' : 'Faculty Colleague'} • ${activeRecipient.email || ''}` : ''}
          />
        </div>
      </div>
    </div>
  );
};
