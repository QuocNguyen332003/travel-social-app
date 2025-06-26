import { ticketService } from "../services/ticketService.js";

const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTickets();
    res.status(200).json({ success: true, data: tickets, message: 'Lấy danh sách vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, data: null, message: 'Vé không tồn tại' });
    res.status(200).json({ success: true, data: ticket, message: 'Lấy vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketService.createTicket(req.body);
    res.status(201).json({ success: true, data: newTicket, message: 'Tạo vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateTicketById = async (req, res) => {
  try {
    const updatedTicket = await ticketService.updateTicketById(req.params.id, req.body);
    if (!updatedTicket) return res.status(404).json({ success: false, data: null, message: 'Vé không tồn tại' });
    res.status(200).json({ success: true, data: updatedTicket, message: 'Cập nhật vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllTickets = async (req, res) => {
  try {
    const updatedTickets = await ticketService.updateAllTickets(req.body);
    res.status(200).json({ success: true, data: updatedTickets, message: 'Cập nhật tất cả vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteTicketById = async (req, res) => {
  try {
    const deletedTicket = await ticketService.deleteTicketById(req.params.id);
    if (!deletedTicket) return res.status(404).json({ success: false, data: null, message: 'Vé không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa vé thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const ticketController = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketById,
  updateAllTickets,
  deleteTicketById,
};
