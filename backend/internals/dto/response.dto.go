package dto

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Results interface{} `json:"results,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SuccessResponse(message string, results interface{}) Response {
	return Response{
		Success: true,
		Message: message,
		Results: results,
	}
}

func ErrorResponse(message string) Response {
	return Response{
		Success: false,
		Message: message,
	}
}
