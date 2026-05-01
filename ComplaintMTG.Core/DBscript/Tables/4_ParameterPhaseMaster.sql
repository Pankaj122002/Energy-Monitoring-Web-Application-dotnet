USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_ParameterPhaseMaster]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_ParameterPhaseMaster](
	[ParameterPhaseID] [int] NOT NULL,
	[MeterPhase] [varchar](50) NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[CreateBy] [varchar](50) NULL,
	[UpdateBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ParameterPhaseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_ParameterPhaseMaster] ([ParameterPhaseID], [MeterPhase], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'No Phase', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_ParameterPhaseMaster] ([ParameterPhaseID], [MeterPhase], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (2, N'All Phase', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_ParameterPhaseMaster] ([ParameterPhaseID], [MeterPhase], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (3, N'R', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_ParameterPhaseMaster] ([ParameterPhaseID], [MeterPhase], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (4, N'Y', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
INSERT [dbo].[tbl_ParameterPhaseMaster] ([ParameterPhaseID], [MeterPhase], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (5, N'B', CAST(N'2025-10-01T09:10:00.000' AS DateTime), NULL, N'adminhk', NULL)
GO
