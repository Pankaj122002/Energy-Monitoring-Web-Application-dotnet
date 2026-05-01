USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_MeterTypeMaster]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_MeterTypeMaster](
	[MeterTypeMasterID] [int] NOT NULL,
	[MeterType] [varchar](50) NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[CreateBy] [varchar](50) NULL,
	[UpdateBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[MeterTypeMasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_MeterTypeMaster] ([MeterTypeMasterID], [MeterType], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'Main Meter', CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_MeterTypeMaster] ([MeterTypeMasterID], [MeterType], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (2, N'Sub Meter', CAST(N'2025-10-01T09:00:00.000' AS DateTime), NULL, N'adminhk', NULL)
GO
