import React, { useState } from "react";
import { Badge, Button, Card, Form, InputGroup } from "react-bootstrap";
import { FiMessageCircle, FiSend, FiX, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../redux/slices/cartSlice";
import { menuAPI } from "../services/api";

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi, I am MOS Assistant. Ask for offers, menu ideas, or type: add chicken burger to cart.",
      suggestions: [],
    },
  ]);

  const pushBotMessage = (payload) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: payload?.reply || "I could not process that right now.",
        suggestions: payload?.suggestions || [],
      },
    ]);
  };

  const addSuggestedItemToCart = (item) => {
    if (!item || user?.role === "ADMIN") {
      return;
    }

    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        base_price: parseFloat(item.base_price || 0),
        price: parseFloat(item.base_price || 0),
        qty: 1,
      }),
    );
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isSending) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await menuAPI.askChatbot(message);
      const payload = response.data || {};
      pushBotMessage(payload);

      if (payload?.action?.type === "add_to_cart" && payload?.action?.item) {
        addSuggestedItemToCart(payload.action.item);
      }
    } catch (error) {
      pushBotMessage({
        reply: "Service is temporarily unavailable. Please try again.",
        suggestions: [],
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <Card
          className="chatbot-widget shadow"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "360px",
            maxWidth: "calc(100vw - 24px)",
            zIndex: 1100,
            borderRadius: "16px",
          }}
        >
          <Card.Header className="d-flex justify-content-between align-items-center bg-danger text-white border-0">
            <strong>MOS Assistant</strong>
            <Button
              variant="link"
              className="text-white p-0"
              onClick={() => setIsOpen(false)}
            >
              <FiX size={18} />
            </Button>
          </Card.Header>

          <Card.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              background: "#fffdf8",
            }}
          >
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className="mb-3">
                <div
                  className={`p-2 rounded-3 ${
                    message.role === "user"
                      ? "bg-danger text-white ms-4"
                      : "bg-white border me-4"
                  }`}
                >
                  {message.text}
                </div>

                {message.role === "bot" && message.suggestions?.length > 0 && (
                  <div className="mt-2 d-flex flex-column gap-2">
                    {message.suggestions.slice(0, 3).map((item) => (
                      <div
                        key={`suggestion-${index}-${item.id}`}
                        className="border rounded-3 p-2 bg-white"
                      >
                        <div className="fw-semibold">{item.name}</div>
                        <div className="small text-muted mb-2">
                          ${parseFloat(item.base_price || 0).toFixed(2)}
                          {item.category_name ? (
                            <Badge bg="light" text="dark" className="ms-2">
                              {item.category_name}
                            </Badge>
                          ) : null}
                        </div>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => addSuggestedItemToCart(item)}
                          disabled={user?.role === "ADMIN"}
                        >
                          <FiShoppingCart className="me-1" /> Add to cart
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Card.Body>

          <Card.Footer className="bg-white border-0">
            <InputGroup>
              <Form.Control
                placeholder="Ask about menu, offers, or add items"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button variant="danger" onClick={handleSend} disabled={isSending}>
                <FiSend />
              </Button>
            </InputGroup>
          </Card.Footer>
        </Card>
      )}

      <Button
        variant="danger"
        className="rounded-circle shadow"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "56px",
          height: "56px",
          zIndex: 1099,
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </Button>
    </>
  );
};

export default ChatbotWidget;
