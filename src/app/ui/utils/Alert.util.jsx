"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { useAlert } from "@/app/scripts/Alert.context";

const getPositionClasses = (position) => {
  const positions = {
    "top-left": "top-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "top-right": "top-6 right-6",
    "middle-left": "top-1/2 -translate-y-1/2 left-6",
    "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "middle-right": "top-1/2 -translate-y-1/2 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
  };
  return positions[position] || positions["top-center"];
};

const getAlertStyles = (type, custom) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      title: "text-green-900",
      icon: "text-green-500",
      button: "hover:bg-green-100",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      title: "text-red-900",
      icon: "text-red-500",
      button: "hover:bg-red-100",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      title: "text-yellow-900",
      icon: "text-yellow-500",
      button: "hover:bg-yellow-100",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      title: "text-blue-900",
      icon: "text-blue-500",
      button: "hover:bg-blue-100",
    },
    custom: {
      bg: custom?.bg || "bg-gray-50",
      border: custom?.border || "border-gray-200",
      text: custom?.text || "text-gray-800",
      title: custom?.title || "text-gray-900",
      icon: custom?.icon || "text-gray-500",
      button: custom?.button || "hover:bg-gray-100",
    },
  };
  return styles[type] || styles.info;
};

const getIcon = (type) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };
  return icons[type] || icons.info;
};

const AlertItem = ({ alert, onClose }) => {
  const styles = getAlertStyles(alert.type, alert.custom);
  const alertRef = useRef(null);
  const [isDisintegrating, setIsDisintegrating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisintegrating(true);
      setTimeout(() => onClose(alert.id), 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [alert.id, onClose]);

  return (
    <motion.div
      ref={alertRef}
      initial={{ opacity: 0, y: -20 }}
      animate={
        isDisintegrating ? { opacity: 0, scale: 0 } : { opacity: 1, y: 0 }
      }
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 flex items-start gap-4 max-w-md backdrop-blur-sm relative overflow-hidden`}
    >
      <div className={`${styles.icon} flex-shrink-0 pt-0.5`}>
        {getIcon(alert.type)}
      </div>
      <div className="flex-1 min-w-0">
        {alert.title && (
          <h3 className={`${styles.title} font-semibold text-sm mb-1`}>
            {alert.title}
          </h3>
        )}
        <p className={`${styles.text} text-sm leading-relaxed`}>
          {alert.message}
        </p>
      </div>
      <button
        onClick={() => onClose(alert.id)}
        className={`${styles.button} text-gray-500 flex-shrink-0 p-1 rounded-md transition-colors`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  const groupedAlerts = alerts.reduce((acc, alert) => {
    const position = alert.position || "top-center";
    if (!acc[position]) acc[position] = [];
    acc[position].push(alert);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedAlerts).map(([position, positionAlerts]) => (
        <div
          key={position}
          className={`fixed ${getPositionClasses(
            position
          )} z-50 pointer-events-none`}
        >
          <AnimatePresence mode="sync">
            <div className="flex flex-col gap-3 pointer-events-auto">
              {positionAlerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} onClose={removeAlert} />
              ))}
            </div>
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};
