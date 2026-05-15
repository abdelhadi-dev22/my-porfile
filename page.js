"use client";

import React, { useState, useEffect } from "react";

export default function MessagesManagement() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="messages-management animate loaded">
      <div className="section-header" style={{ textAlign: "left", marginBottom: "2rem" }}>
        <h2 className="section-title">Messages Inbox</h2>
        <p className="section-subtitle" style={{ margin: "0" }}>Manage inquiries from your contact form</p>
      </div>
      
      {isLoading ? (
        <div className="spinner-container" style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: messages.length > 0 ? "1fr 400px" : "1fr", gap: "2rem" }}>
          {/* List */}
          <div className="table-container" style={{ 
            background: "var(--surface)", 
            borderRadius: "var(--radius-lg)", 
            border: "1px solid var(--surface-border)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", textAlign: "left", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  <th style={{ padding: "1.25rem" }}>Sender</th>
                  <th style={{ padding: "1.25rem" }}>Service</th>
                  <th style={{ padding: "1.25rem" }}>Date</th>
                  <th style={{ padding: "1.25rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      onClick={() => setSelectedMessage(msg)}
                      style={{ 
                        borderBottom: "1px solid var(--surface-border)",
                        cursor: "pointer",
                        background: selectedMessage?.id === msg.id ? "rgba(99, 102, 241, 0.05)" : "transparent",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ fontWeight: "600" }}>{msg.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{msg.email}</div>
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <span className="tech-tag">{msg.service || "General"}</span>
                      </td>
                      <td style={{ padding: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1.25rem", textAlign: "right" }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          style={{ color: "var(--danger)", border: "none", background: "none", cursor: "pointer", padding: "0.5rem" }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Details Sidebar */}
          {selectedMessage && (
            <div className="message-details animate loaded" style={{ 
              background: "var(--surface)", 
              borderRadius: "var(--radius-lg)", 
              border: "1px solid var(--surface-border)",
              padding: "2rem",
              height: "fit-content",
              position: "sticky",
              top: "2rem"
            }}>
              <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Message Details</h3>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.25rem" }}>From</label>
                <div style={{ fontWeight: "600" }}>{selectedMessage.name}</div>
                <div style={{ color: "var(--primary-light)" }}>{selectedMessage.email}</div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.25rem" }}>Phone</label>
                <div>{selectedMessage.phone || "Not provided"}</div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.25rem" }}>Message</label>
                <div style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "1rem", 
                  borderRadius: "var(--radius-md)", 
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap"
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <a 
                  href={`mailto:${selectedMessage.email}`} 
                  className="btn btn-primary" 
                  style={{ flex: 1, fontSize: "0.875rem", padding: "0.75rem" }}
                >
                  <i className="fas fa-reply"></i> Reply
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
