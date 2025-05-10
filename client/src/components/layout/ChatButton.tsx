import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chatbot/ChatInterface";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  return (
    <>
      <div className="fixed right-6 bottom-6 z-10">
        <Button
          onClick={() => {
            setIsOpen(true);
            setHasNewMessage(false);
          }}
          className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
        {hasNewMessage && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 p-0 rounded-full">
            1
          </Badge>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] h-[600px] p-0 flex flex-col">
          <ChatInterface onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;
