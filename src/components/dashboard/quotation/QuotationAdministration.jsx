import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Modal,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment
} from "@mui/material";
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import HeaderCard from "../../HeaderCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import GemLoader from "../../loader/GemLoader";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CreateQuotation from "../calculator/CreateQuotation";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import apiClient from "../../../app/axiosConfig";

const columns = [
  { columnLabel: "Quotation ID", columnKey: "id" },
  // { columnLabel: "Image", columnKey: "imageUrl" },
  { columnLabel: "Price", columnKey: "price" },
  // { columnLabel: "Agent ID", columnKey: "agentId" },
  { columnLabel: "Client", columnKey: "clientId" },
  { columnLabel: "Status", columnKey: "quotationStatus" },
  { columnLabel: "Created At", columnKey: "createdAt" },
  { columnLabel: "Updated At", columnKey: "updatedAt" },
  { columnLabel: "Actions", columnKey: "actions" },
];

const QuotationAdministration = () => {
  const { token, id, roles } = useSelector((state) => state.user.userDetails || {});
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState({});
  const [quotationTable, setQuotationTable] = useState([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [dropdownUsers, setDropdownUsers] = useState({});
  
  const pageSize = 10;

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `businessAdmin/getAllAgents?offset=0&size=100`
      );

      let userMap = {};
      if (response?.status === 200) {
        const userData = response?.data?.data;
        console.log("Agents data:", userData);
        userMap = {
          ...Object.fromEntries(userData.map((user) => [user.id, user.username])),
          all: "All",
        };
      }
      setDropdownUsers(userMap);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  }, []);

  const fetchQuotations = useCallback(
    async (currentPage = 1) => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * pageSize;
        let response;
        
        if (roles?.[0] === "business_admin" && selectedAgent !== "all") {
          // For business admin filtering by specific agent
          response = await apiClient.get(
            `/agent/getAllQuotationsByAgent?offset=${offset}&size=${pageSize}&agentId=${selectedAgent}`
          );
        } else if (roles?.[0] === "business_admin" && selectedAgent === "all") {
          // For business admin showing all quotations
          response = await apiClient.get(
            `businessAdmin/quotations?offset=${offset}&size=${pageSize}&sortBy=id`
          );
        } else {
          // For regular agents
          response = await apiClient.get(
            `/agent/getAllQuotationsByAgent?offset=${offset}&size=${pageSize}&agentId=${id}`
          );
        }
        
        console.log("Quotations", response?.data?.data)
        if (response?.data) {
          const fetchedQuotations = response?.data?.data || [];
          setQuotations(fetchedQuotations);
          setTotalRecords(response?.data?.totalRecords || 0);
          setTotalPages(Math.ceil((response?.data?.totalRecords || 0) / pageSize));
        }
      } catch (err) {
        console.error("Error fetching quotations:", err);
        setError("Failed to fetch quotations. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [id, pageSize, roles, selectedAgent]
  );

    useEffect(() => {
    if (roles?.[0] === "business_admin") {
      fetchAllUsers();
    }
    fetchQuotations(page);
  }, [fetchQuotations, page, roles, fetchAllUsers]);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleAgentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAgent(selectedValue);
    setPage(1); // Reset to first page when changing agent
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isSaving) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GemLoader />
      </div>
    );
  }

  // Handler stubs for actions
  const handleEdit = (quotation) => {
    console.log("Edit clicked", quotation);
    try {
      const data = JSON.parse(quotation?.data);
      setQuotationDetails(data?.quotationDetails || {});
      setQuotationTable(data?.quotationTable || []);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error parsing quotation data for edit:', error);
      toast.error('Error loading quotation data for editing');
    }
  };
  const handlePreview = (quotation) => {
    setPreviewImage(quotation?.imageUrl);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewImage(null);
  };

  const handleDelete = async (quotation) => {
    setLoading(true);
      setError(null);
      try {
        const response = await apiClient.delete(
          `agent/deleteQuotation?quotationId=${quotation?.id}`
        );
        if (response?.status === 200){
          toast.success(`Quotation Deleted Successfully!`)
          // Refresh the data after deletion
          fetchQuotations(page);
        } else {
          toast.error(`Failed To Delete Quotation!`)
        }
      } catch (err) {
        console.error("Error Deleting quotation:", err);
        setError("Failed to delete quotation. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  const handleStatusChange = async (quotation, newStatus) => {
    console.log("Status changed for quotation:", quotation, "New status:", newStatus);
    setIsSaving(true);
    try {  
      let requestBody = {
        quotationId: quotation?.quotationId,
        quotationStatus: newStatus
      };

      const response = await apiClient.post(
        `/agent/updateQuotation`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      
      // Update the local state to reflect the change
      // Refresh the data after status change
      fetchQuotations(page);
      
      toast.success(`Status Changed Successfully!`);
    } catch (error) {
      console.error("Error Saving Status Change", error);
      toast.error("Error While Changing Status of Quotation!");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const searchMatch = searchTerm
      ? JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  
    const statusMatch =
      statusFilter === "all" || q?.quotationStatus === statusFilter;
  
    return searchMatch && statusMatch;
  });
  

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section */}
      <HeaderCard icon="💍" color="teal" title="Quotation Management" description="Manage quotations and pricing"></HeaderCard>

      {/* Stats Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow !bg-gradient-to-r !from-purple-100 !to-indigo-100">
          <CardContent className="flex items-center p-4">
            <Avatar className="!bg-blue-500 mr-4">
              <AttachMoneyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-bold">
                {totalRecords}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Total Quotations
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow !bg-gradient-to-r !from-purple-100 !to-indigo-100">
          <CardContent className="flex items-center p-4">
            <Avatar className="!bg-green-500 mr-4">
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-bold">
                {
                  quotations.filter((q) => q?.quotationStatus === "pending")
                    .length
                }
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Pending Quotations
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow !bg-gradient-to-r !from-purple-100 !to-indigo-100">
          <CardContent className="flex items-center p-4">
            <Avatar className="!bg-purple-500 mr-4">
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-bold">
                $
                {quotations
                  .reduce((sum, q) => sum + (q.price || 0), 0)
                  .toFixed(2)}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Total Value
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter Section */}
      <Card className="shadow-lg mb-6">
        <CardContent>
          <Box className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <Box className="flex-1 w-full md:w-auto mb-10">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#4c257e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4c257e',
                      },
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc',
                  }
                }}
              />
            </Box>

            {/* Agent Filter - Only for business_admin */}
            {roles?.[0] === "business_admin" && (
              <Box className="w-full md:w-48 mb-10">
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={selectedAgent}
                    onChange={handleAgentChange}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="text-gray-400">👤</span>
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#4c257e',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4c257e',
                        },
                      },
                    }}
                  >
                    {Object.entries(dropdownUsers).map(([key, value]) => (
                      <MenuItem key={key} value={key} sx={{ fontSize: "0.875rem" }}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Status Filter */}
            <Box className="w-full md:w-48 mb-10">
              <FormControl fullWidth variant="outlined">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon className="text-gray-400" />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#4c257e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4c257e',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Results Count */}
            <Box className="text-center md:text-right mb-10">
              <Typography variant="body2" className="text-gray-600">
                Showing {filteredQuotations.length} of {totalRecords} results
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Main Table Card */}
      <Card className="shadow-lg">
        <CardContent>
          {/* Table Header */}
          <Box className="flex justify-between items-center mb-4">
            <Typography
              variant="h5"
              className="text-[#4c257e] font-bold flex items-center"
            >
              <ImageIcon className="mr-2" />
              Quotations List
            </Typography>

            {/* Pagination Info */}
            <Box className="flex items-center justify-between flex-wrap gap-4 mt-4">
              <Typography variant="body2" className="text-gray-600">
                {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, totalRecords)} of {totalRecords}
              </Typography>

              <Box className="flex gap-2 items-center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handlePageChange("prev")}
                  disabled={page === 1 || loading}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#4c257e',
                    color: '#4c257e',
                    '&:hover': {
                      borderColor: '#3730a3',
                      backgroundColor: '#f3f4f6',
                    },
                    '&:disabled': {
                      borderColor: '#d1d5db',
                      color: '#9ca3af',
                    }
                  }}
                >
                  <ArrowBack />
                </Button>

                <Typography variant="body2" className="text-gray-600">
                  Page {page} of {totalPages}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handlePageChange("next")}
                  disabled={page === totalPages || loading || totalPages === 0}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#4c257e',
                    color: '#4c257e',
                    '&:hover': {
                      borderColor: '#3730a3',
                      backgroundColor: '#f3f4f6',
                    },
                    '&:disabled': {
                      borderColor: '#d1d5db',
                      color: '#9ca3af',
                    }
                  }}
                >
                  <ArrowForward />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box className="flex justify-center items-center py-8">
              <GemLoader size={30} />
            </Box>
          )}

          {/* Table */}
          {!loading && quotations.length > 0 && (
            <TableContainer 
              component={Paper} 
              className="shadow-md"
              sx={{ 
                maxHeight: '600px',
                paddingBottom: 18,
                '& .MuiTable-root': {
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                }
              }}
            >
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="quotations table">
                <TableHead>
                  <TableRow className="!bg-gradient-to-r !from-purple-100 !to-indigo-200">
                    {columns?.map((col) => (
                      <TableCell
                        key={col.columnKey}
                        className="!font-bold !text-[#4c257e]"
                        sx={{ 
                          fontSize: "0.95rem",
                          backgroundColor: '#f8fafc',
                          borderBottom: '2px solid #e5e7eb',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                          padding: '12px 16px',
                          fontWeight: 600,
                        }}
                      >
                        {col.columnLabel}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredQuotations?.map((quotation, index) => (
                    <TableRow
                      key={quotation?.id}
                      className={`hover:!bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "!bg-white" : "!bg-gray-25"
                      }`}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        }
                      }}
                    >
                      <TableCell 
                        className="!font-medium"
                        sx={{ padding: '12px 16px' }}
                      >
                        #{quotation?.quotationId}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography
                          variant="body2"
                          className="font-semibold text-green-600"
                        >
                          ${quotation?.price?.toFixed(2) || "0.00"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography
                          variant="body1"
                          className="font-semibold text-gray-600"
                        >
                          {(() => {
                            try {
                              const parsedData = JSON.parse(quotation?.data);
                              return parsedData?.client?.clientName || 'Unknown Client';
                            } catch {
                              return 'Unknown Client';
                            }
                          })()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={quotation?.quotationStatus || "pending"}
                            onChange={(e) => handleStatusChange(quotation, e.target.value)}
                            displayEmpty
                            sx={{
                              '& .MuiSelect-select': {
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                borderRadius: '16px',
                                backgroundColor: () => {
                                  const status = quotation?.quotationStatus || "pending";
                                  switch (status.toLowerCase()) {
                                    case 'pending': return '#fef3c7';
                                    case 'approved': return '#d1fae5';
                                    case 'declined': return '#fee2e2';
                                    case 'in progress': return '#dbeafe';
                                    case 'completed': return '#dcfce7';
                                    default: return '#f3f4f6';
                                  }
                                },
                                color: () => {
                                  const status = quotation?.quotationStatus || "pending";
                                  switch (status.toLowerCase()) {
                                    case 'pending': return '#92400e';
                                    case 'approved': return '#065f46';
                                    case 'declined': return '#991b1b';
                                    case 'in progress': return '#1e40af';
                                    case 'completed': return '#166534';
                                    default: return '#374151';
                                  }
                                },
                                border: 'none',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                '&:hover': {
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                },
                                '&:focus': {
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                }
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  borderRadius: '12px',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                  '& .MuiMenuItem-root': {
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    padding: '8px 16px',
                                    '&:hover': {
                                      backgroundColor: '#f8fafc',
                                    },
                                    '&.Mui-selected': {
                                      backgroundColor: '#e0e7ff',
                                      color: '#3730a3',
                                      '&:hover': {
                                        backgroundColor: '#c7d2fe',
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                          >
                            <MenuItem value="pending" sx={{ color: '#92400e', backgroundColor: '#fef3c7' }}>
                              Pending
                            </MenuItem>
                            <MenuItem value="approved" sx={{ color: '#065f46', backgroundColor: '#d1fae5' }}>
                              Approved
                            </MenuItem>
                            <MenuItem value="declined" sx={{ color: '#991b1b', backgroundColor: '#fee2e2' }}>
                              Declined
                            </MenuItem>
                            <MenuItem value="in progress" sx={{ color: '#1e40af', backgroundColor: '#dbeafe' }}>
                              In Progress
                            </MenuItem>
                            <MenuItem value="completed" sx={{ color: '#166534', backgroundColor: '#dcfce7' }}>
                              Completed
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(quotation?.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(quotation?.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <EditIcon
                          style={{ cursor: "pointer", marginRight: 8 }}
                          color="primary"
                          onClick={() => handleEdit(quotation)}
                          titleAccess="Edit"
                          sx={{
                            '&:hover': {
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s ease-in-out',
                            }
                          }}
                        />
                        <VisibilityIcon
                          style={{ cursor: "pointer", marginRight: 8 }}
                          color="action"
                          onClick={() => handlePreview(quotation)}
                          titleAccess="Preview"
                          sx={{
                            '&:hover': {
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s ease-in-out',
                            }
                          }}
                        />
                        <DeleteIcon
                          style={{ cursor: "pointer" }}
                          color="error"
                          onClick={() => handleDelete(quotation)}
                          titleAccess="Delete"
                          sx={{
                            '&:hover': {
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s ease-in-out',
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Empty State */}
          {!loading && quotations.length === 0 && (
            <Box className="text-center py-12">
              <ImageIcon className="!text-6xl text-gray-300 mb-4" />
              <Typography variant="h6" className="text-gray-500 mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching quotations found" : "No quotations found"}
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters." 
                  : "There are no quotations to display at the moment."
                }
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ className: "rounded-xl shadow-lg p-4" }}
        TransitionProps={{ timeout: 300 }}
      >
        <Box className="flex justify-between items-center">
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <CreateQuotation isEdit={true} quotationDetails={quotationDetails} quotationTable={quotationTable} />
        </DialogContent>
      </Dialog>

      <Modal open={openPreview} onClose={handleClosePreview}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.9)",
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              bgcolor: "#111",
              borderRadius: 3,
              boxShadow: 8,
              overflow: "hidden",
            }}
          >
            {/* Close Button Top Right */}
            <IconButton
              onClick={handleClosePreview}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Image */}
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                borderRadius: "12px",
                margin: "auto",
              }}
            />

            {/* Button Group */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 2,
                mb: 2,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={handleClosePreview}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = previewImage;
                  link.download = "quotation-image.jpg";
                  link.click();
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default QuotationAdministration;
