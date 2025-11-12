"use client";

import { useState, useRef } from "react";
import Draggable from "react-draggable";
import type { Task, List } from "@/types";
import ListsModal from "./lists-modal";
import EditTaskModal from "./edit-task-modal";
import { Calendar, TriangleAlert } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

interface TodoWindowProps {
  onClose: () => void;
  tasks: Task[];
  lists: List[];
  activeListId: string;
  currentFilter: string;

  onAddTask: (task: Task) => void;
  onToggleTaskCompletion: (taskId: number) => void;
  onClearCompletedTasks: () => void;
  onChangeFilter: (filter: string) => void;
  onChangeActiveList: (listId: string) => void;
  onAddList: (list: List) => void;
  onDeleteList: (listId: string) => void;
  onClearAllTasks: (listId: string) => void; 
}

export default function TodoWindow({
  onClose,
  tasks,
  lists,
  activeListId,
  currentFilter,
  onAddTask,
  onToggleTaskCompletion,
  onClearCompletedTasks,
  onChangeFilter,
  onChangeActiveList,
  onAddList,
  onDeleteList,
  onClearAllTasks, 
}: TodoWindowProps) {
  const nodeRef = useRef(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [isListsModalOpen, setIsListsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const getFilteredTasks = () => {
    let filteredTasks = tasks.filter((task) => task.listId === activeListId);
    if (currentFilter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }
    return filteredTasks;
  };

  

  const addTask = () => {
    if (newTaskText.trim() !== "") {
      const task: Task = {
        id: Date.now(),
        title: newTaskText.trim(),
        description: "",
        completed: false,
        dueDate: "",
        dueTime: "",
        priority: "medium",
        listId: activeListId,
      };
      onAddTask(task);
      setNewTaskText("");
    }
  };

  const formatDueDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", options);
    if (timeStr) formattedDate += ` at ${timeStr}`;
    return formattedDate;
  };

  const isDueDateExpired = (dateStr: string, timeStr: string) => {
    if (!dateStr) return false;
    const now = new Date();
    const dueDate = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      dueDate.setHours(hours, minutes);
    } else {
      dueDate.setHours(23, 59, 59);
    }
    return now > dueDate;
  };

  const getActiveListName = () => {
    const activeList = lists.find((list) => list.id === activeListId);
    return activeList ? activeList.name : "Tasks";
  };

  const countActiveTasks = () => {
    return tasks.filter((task) => task.listId === activeListId && !task.completed).length;
  };

  const getActiveListColor = () => {
    const activeList = lists.find((list) => list.id === activeListId);
    return activeList ? activeList.color : "#9764c7";
  };

  

  const activeListColor = getActiveListColor();

  return (
    <>
      <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={{ x: 20, y: 20 }}>
        <div
          ref={nodeRef}
          className="w-[90vw] md:w-[380px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          md:absolute md:top-5 md:left-5 md:translate-y-0 z-[9999] 
          bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-5 cursor-move text-white"
        >
          {/* HEADER */}
          <header className="flex justify-between items-center mb-4">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsListsModalOpen(true)}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-inner"
                style={{ backgroundColor: activeListColor }}
              >
                {getActiveListName().charAt(0)}
              </div>
              <h1 className="text-lg font-semibold truncate max-w-[150px]">{getActiveListName()}</h1>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-white transition"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <button
              className="text-xl font-light hover:text-red-400 transition"
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <hr className="border-white/20 mb-4" />

          {/* FILTER BUTTONS + ADD BUTTON INLINE */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-3">
              {["all", "active", "completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => onChangeFilter(filter)}
                  className={`py-1.5 px-4 rounded-full text-xs font-medium capitalize transition
                    ${
                      currentFilter === filter
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* ADD BUTTON */}
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition"
            aria-label="Add Task"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          </div>


          {/* TASK LIST */}
          <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-1 scrollbar-hide">
            {getFilteredTasks().length === 0 ? (
              <div className="text-center py-10 text-white-400">
                <p>Task list is empty</p>
                <p className="text-xs opacity-100 mt-1">Start managing your work by creating a task</p>
              </div>
            ) : (
              getFilteredTasks().map((task) => {
                const isExpired = isDueDateExpired(task.dueDate, task.dueTime);
                return (
                  <div
                    key={task.id}
                    className="flex flex-col bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTaskCompletion(task.id)}
                        className="w-5 h-5 mr-3 accent-yellow-400 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            task.completed ? "line-through text-gray-400" : "text-white"
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentEditTask(task);
                          setIsEditTaskModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-yellow-400 transition ml-2"
                      >
                        ✎
                      </button>
                    </div>

                    {(task.dueDate || task.priority) && (
                      <div className="flex gap-4 text-xs text-gray-400 mt-1 ml-8">
                        {task.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDueDate(task.dueDate, task.dueTime)}
                            {isExpired && !task.completed && (
                              <TriangleAlert className="w-3 h-3 ml-1 text-red-500" />
                            )}
                          </div>
                        )}
                        {task.priority && (
                          <div className="flex items-center">
                            <span
                              className={`w-2 h-2 rounded-full mr-1 ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                              }`}
                            ></span>
                            {task.priority}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ✅ UPDATED FOOTER */}
          <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10 text-xs text-gray-400">
            {currentFilter === "completed" ? (
              <>
                <button
                  onClick={onClearCompletedTasks}
                  className="hover:text-yellow-400 transition"
                >
                  Clear completed
                </button>
                <span>
                  {countActiveTasks()} {countActiveTasks() !== 1 ? "items" : "item"}
                </span>
              </>
            ) : (
              <>
                
                <span>
                  {countActiveTasks()} {countActiveTasks() !== 1 ? "items" : "item"}
                </span>
              </>
            )}
          </div>
        </div>
      </Draggable>

      {/* MODALS */}
      {isListsModalOpen && (
        <ListsModal
          lists={lists}
          activeListId={activeListId}
          onClose={() => setIsListsModalOpen(false)}
          onChangeActiveList={onChangeActiveList}
          onAddList={onAddList}
          onDeleteList={onDeleteList}
        />
      )}

      {isEditTaskModalOpen && currentEditTask && (
        <EditTaskModal
          task={currentEditTask}
          onClose={() => setIsEditTaskModalOpen(false)}
          onSave={() => setIsEditTaskModalOpen(false)}
          onDelete={() => setIsEditTaskModalOpen(false)}
        />
      )}

      {isAddTaskModalOpen && (
      <AddTaskModal
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={(task) => {
          task.listId = activeListId;
          onAddTask(task);
        }}
      />
      )}

    </>
  );
}




