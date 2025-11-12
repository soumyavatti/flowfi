"use client";
import { useState } from "react";

export default function AddTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title,
      description,
      dueDate,
      dueTime: time,
      priority,
      completed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-[90%] max-w-md text-white relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button onClick={onClose} className="text-xl font-light hover:text-red-400 transition">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Task Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Task Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm mb-1">Due Date (Optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Time (Optional)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 rounded-xl bg-Black/10 border border-Black/20 text-white focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full mt-6 py-2 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 transition"
        >
          Add Now
        </button>
      </div>
    </div>
  );
}
