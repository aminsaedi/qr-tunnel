var __LKProtoTmp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@livekit/protocol/dist/index.mjs
  var index_exports = {};
  __export(index_exports, {
    AcceptWhatsAppCallRequest: () => AcceptWhatsAppCallRequest,
    AcceptWhatsAppCallResponse: () => AcceptWhatsAppCallResponse,
    ActiveSpeakerUpdate: () => ActiveSpeakerUpdate,
    AddTrackRequest: () => AddTrackRequest,
    AgentDispatch: () => AgentDispatch,
    AgentDispatchState: () => AgentDispatchState,
    AgentSession: () => livekit_agent_session_pb,
    AliOSSUpload: () => AliOSSUpload,
    AudioCodec: () => AudioCodec,
    AudioMixing: () => AudioMixing,
    AudioTrackFeature: () => AudioTrackFeature,
    AutoParticipantEgress: () => AutoParticipantEgress,
    AutoTrackEgress: () => AutoTrackEgress,
    AvailabilityRequest: () => AvailabilityRequest,
    AvailabilityResponse: () => AvailabilityResponse,
    AzureBlobUpload: () => AzureBlobUpload,
    BackupCodecPolicy: () => BackupCodecPolicy,
    CandidateProtocol: () => CandidateProtocol,
    ChatMessage: () => ChatMessage,
    ClientConfigSetting: () => ClientConfigSetting,
    ClientConfiguration: () => ClientConfiguration,
    ClientInfo: () => ClientInfo,
    ClientInfo_SDK: () => ClientInfo_SDK,
    Codec: () => Codec,
    ConnectTwilioCallRequest: () => ConnectTwilioCallRequest,
    ConnectTwilioCallRequest_TwilioCallDirection: () => ConnectTwilioCallRequest_TwilioCallDirection,
    ConnectTwilioCallResponse: () => ConnectTwilioCallResponse,
    ConnectWhatsAppCallRequest: () => ConnectWhatsAppCallRequest,
    ConnectWhatsAppCallResponse: () => ConnectWhatsAppCallResponse,
    ConnectionQuality: () => ConnectionQuality,
    ConnectionQualityInfo: () => ConnectionQualityInfo,
    ConnectionQualityUpdate: () => ConnectionQualityUpdate,
    ConnectionSettings: () => ConnectionSettings,
    ConnectorType: () => ConnectorType,
    CreateAgentDispatchRequest: () => CreateAgentDispatchRequest,
    CreateIngressRequest: () => CreateIngressRequest,
    CreateRoomRequest: () => CreateRoomRequest,
    CreateSIPDispatchRuleRequest: () => CreateSIPDispatchRuleRequest,
    CreateSIPInboundTrunkRequest: () => CreateSIPInboundTrunkRequest,
    CreateSIPOutboundTrunkRequest: () => CreateSIPOutboundTrunkRequest,
    CreateSIPParticipantRequest: () => CreateSIPParticipantRequest,
    CreateSIPTrunkRequest: () => CreateSIPTrunkRequest,
    DataChannelInfo: () => DataChannelInfo,
    DataChannelReceiveState: () => DataChannelReceiveState,
    DataPacket: () => DataPacket,
    DataPacket_Kind: () => DataPacket_Kind,
    DataStream: () => DataStream,
    DataStream_ByteHeader: () => DataStream_ByteHeader,
    DataStream_Chunk: () => DataStream_Chunk,
    DataStream_Header: () => DataStream_Header,
    DataStream_OperationType: () => DataStream_OperationType,
    DataStream_TextHeader: () => DataStream_TextHeader,
    DataStream_Trailer: () => DataStream_Trailer,
    DataTrackExtensionID: () => DataTrackExtensionID,
    DataTrackExtensionParticipantSid: () => DataTrackExtensionParticipantSid,
    DataTrackInfo: () => DataTrackInfo,
    DataTrackSubscriberHandles: () => DataTrackSubscriberHandles,
    DataTrackSubscriberHandles_PublishedDataTrack: () => DataTrackSubscriberHandles_PublishedDataTrack,
    DataTrackSubscriptionOptions: () => DataTrackSubscriptionOptions,
    DeleteAgentDispatchRequest: () => DeleteAgentDispatchRequest,
    DeleteIngressRequest: () => DeleteIngressRequest,
    DeleteRoomRequest: () => DeleteRoomRequest,
    DeleteRoomResponse: () => DeleteRoomResponse,
    DeleteSIPDispatchRuleRequest: () => DeleteSIPDispatchRuleRequest,
    DeleteSIPTrunkRequest: () => DeleteSIPTrunkRequest,
    Destination: () => Destination,
    DialWhatsAppCallRequest: () => DialWhatsAppCallRequest,
    DialWhatsAppCallResponse: () => DialWhatsAppCallResponse,
    DirectFileOutput: () => DirectFileOutput,
    DisabledCodecs: () => DisabledCodecs,
    DisconnectReason: () => DisconnectReason,
    DisconnectWhatsAppCallRequest: () => DisconnectWhatsAppCallRequest,
    DisconnectWhatsAppCallRequest_DisconnectReason: () => DisconnectWhatsAppCallRequest_DisconnectReason,
    DisconnectWhatsAppCallResponse: () => DisconnectWhatsAppCallResponse,
    EgressInfo: () => EgressInfo,
    EgressSourceType: () => EgressSourceType,
    EgressStatus: () => EgressStatus,
    EncodedFileOutput: () => EncodedFileOutput,
    EncodedFileType: () => EncodedFileType,
    EncodingOptions: () => EncodingOptions,
    EncodingOptionsPreset: () => EncodingOptionsPreset,
    EncryptedPacket: () => EncryptedPacket,
    EncryptedPacketPayload: () => EncryptedPacketPayload,
    Encryption: () => Encryption,
    Encryption_Type: () => Encryption_Type,
    EventMetric: () => EventMetric,
    FileInfo: () => FileInfo,
    FilterParams: () => FilterParams,
    ForwardParticipantRequest: () => ForwardParticipantRequest,
    ForwardParticipantResponse: () => ForwardParticipantResponse,
    GCPUpload: () => GCPUpload,
    GetSIPInboundTrunkRequest: () => GetSIPInboundTrunkRequest,
    GetSIPInboundTrunkResponse: () => GetSIPInboundTrunkResponse,
    GetSIPOutboundTrunkRequest: () => GetSIPOutboundTrunkRequest,
    GetSIPOutboundTrunkResponse: () => GetSIPOutboundTrunkResponse,
    ICEServer: () => ICEServer,
    ImageCodec: () => ImageCodec,
    ImageFileSuffix: () => ImageFileSuffix,
    ImageOutput: () => ImageOutput,
    ImagesInfo: () => ImagesInfo,
    IngressAudioEncodingOptions: () => IngressAudioEncodingOptions,
    IngressAudioEncodingPreset: () => IngressAudioEncodingPreset,
    IngressAudioOptions: () => IngressAudioOptions,
    IngressInfo: () => IngressInfo,
    IngressInput: () => IngressInput,
    IngressState: () => IngressState,
    IngressState_Status: () => IngressState_Status,
    IngressVideoEncodingOptions: () => IngressVideoEncodingOptions,
    IngressVideoEncodingPreset: () => IngressVideoEncodingPreset,
    IngressVideoOptions: () => IngressVideoOptions,
    InputAudioState: () => InputAudioState,
    InputVideoState: () => InputVideoState,
    Job: () => Job,
    JobAssignment: () => JobAssignment,
    JobState: () => JobState,
    JobStatus: () => JobStatus,
    JobTermination: () => JobTermination,
    JobType: () => JobType,
    JoinRequest: () => JoinRequest,
    JoinResponse: () => JoinResponse,
    LeaveRequest: () => LeaveRequest,
    LeaveRequest_Action: () => LeaveRequest_Action,
    ListAgentDispatchRequest: () => ListAgentDispatchRequest,
    ListAgentDispatchResponse: () => ListAgentDispatchResponse,
    ListEgressRequest: () => ListEgressRequest,
    ListEgressResponse: () => ListEgressResponse,
    ListIngressRequest: () => ListIngressRequest,
    ListIngressResponse: () => ListIngressResponse,
    ListParticipantsRequest: () => ListParticipantsRequest,
    ListParticipantsResponse: () => ListParticipantsResponse,
    ListRoomsRequest: () => ListRoomsRequest,
    ListRoomsResponse: () => ListRoomsResponse,
    ListSIPDispatchRuleRequest: () => ListSIPDispatchRuleRequest,
    ListSIPDispatchRuleResponse: () => ListSIPDispatchRuleResponse,
    ListSIPInboundTrunkRequest: () => ListSIPInboundTrunkRequest,
    ListSIPInboundTrunkResponse: () => ListSIPInboundTrunkResponse,
    ListSIPOutboundTrunkRequest: () => ListSIPOutboundTrunkRequest,
    ListSIPOutboundTrunkResponse: () => ListSIPOutboundTrunkResponse,
    ListSIPTrunkRequest: () => ListSIPTrunkRequest,
    ListSIPTrunkResponse: () => ListSIPTrunkResponse,
    ListUpdate: () => ListUpdate,
    MediaSectionsRequirement: () => MediaSectionsRequirement,
    MetricLabel: () => MetricLabel,
    MetricSample: () => MetricSample,
    MetricsBatch: () => MetricsBatch,
    MetricsRecordingHeader: () => MetricsRecordingHeader,
    MigrateJobRequest: () => MigrateJobRequest,
    MoveParticipantRequest: () => MoveParticipantRequest,
    MoveParticipantResponse: () => MoveParticipantResponse,
    MuteRoomTrackRequest: () => MuteRoomTrackRequest,
    MuteRoomTrackResponse: () => MuteRoomTrackResponse,
    MuteTrackRequest: () => MuteTrackRequest,
    PacketTrailerFeature: () => PacketTrailerFeature,
    Pagination: () => Pagination,
    ParticipantEgressRequest: () => ParticipantEgressRequest,
    ParticipantInfo: () => ParticipantInfo,
    ParticipantInfo_Kind: () => ParticipantInfo_Kind,
    ParticipantInfo_KindDetail: () => ParticipantInfo_KindDetail,
    ParticipantInfo_State: () => ParticipantInfo_State,
    ParticipantPermission: () => ParticipantPermission,
    ParticipantTracks: () => ParticipantTracks,
    ParticipantUpdate: () => ParticipantUpdate,
    PerformRpcRequest: () => PerformRpcRequest,
    PerformRpcResponse: () => PerformRpcResponse,
    Ping: () => Ping,
    PlayoutDelay: () => PlayoutDelay,
    Pong: () => Pong,
    ProviderInfo: () => ProviderInfo,
    ProviderType: () => ProviderType,
    ProxyConfig: () => ProxyConfig,
    PublishDataTrackRequest: () => PublishDataTrackRequest,
    PublishDataTrackResponse: () => PublishDataTrackResponse,
    RTCPSenderReportState: () => RTCPSenderReportState,
    RTPDrift: () => RTPDrift,
    RTPForwarderState: () => RTPForwarderState,
    RTPMungerState: () => RTPMungerState,
    RTPStats: () => RTPStats,
    ReconnectReason: () => ReconnectReason,
    ReconnectResponse: () => ReconnectResponse,
    RegionInfo: () => RegionInfo,
    RegionSettings: () => RegionSettings,
    RegisterWorkerRequest: () => RegisterWorkerRequest,
    RegisterWorkerResponse: () => RegisterWorkerResponse,
    RemoveParticipantResponse: () => RemoveParticipantResponse,
    RequestResponse: () => RequestResponse,
    RequestResponse_Reason: () => RequestResponse_Reason,
    Room: () => Room,
    RoomAgent: () => RoomAgent,
    RoomAgentDispatch: () => RoomAgentDispatch,
    RoomCompositeEgressRequest: () => RoomCompositeEgressRequest,
    RoomConfiguration: () => RoomConfiguration,
    RoomEgress: () => RoomEgress,
    RoomMovedResponse: () => RoomMovedResponse,
    RoomParticipantIdentity: () => RoomParticipantIdentity,
    RoomUpdate: () => RoomUpdate,
    RpcAck: () => RpcAck,
    RpcError: () => RpcError,
    RpcRequest: () => RpcRequest,
    RpcResponse: () => RpcResponse,
    S3Upload: () => S3Upload,
    SIPCallDirection: () => SIPCallDirection,
    SIPCallInfo: () => SIPCallInfo,
    SIPCallStatus: () => SIPCallStatus,
    SIPDispatchRule: () => SIPDispatchRule,
    SIPDispatchRuleCallee: () => SIPDispatchRuleCallee,
    SIPDispatchRuleDirect: () => SIPDispatchRuleDirect,
    SIPDispatchRuleIndividual: () => SIPDispatchRuleIndividual,
    SIPDispatchRuleInfo: () => SIPDispatchRuleInfo,
    SIPDispatchRuleUpdate: () => SIPDispatchRuleUpdate,
    SIPFeature: () => SIPFeature,
    SIPHeaderOptions: () => SIPHeaderOptions,
    SIPInboundTrunkInfo: () => SIPInboundTrunkInfo,
    SIPInboundTrunkUpdate: () => SIPInboundTrunkUpdate,
    SIPMediaEncryption: () => SIPMediaEncryption,
    SIPOutboundConfig: () => SIPOutboundConfig,
    SIPOutboundTrunkInfo: () => SIPOutboundTrunkInfo,
    SIPOutboundTrunkUpdate: () => SIPOutboundTrunkUpdate,
    SIPParticipantInfo: () => SIPParticipantInfo,
    SIPStatus: () => SIPStatus,
    SIPStatusCode: () => SIPStatusCode,
    SIPTransferInfo: () => SIPTransferInfo,
    SIPTransferStatus: () => SIPTransferStatus,
    SIPTransport: () => SIPTransport,
    SIPTrunkInfo: () => SIPTrunkInfo,
    SIPTrunkInfo_TrunkKind: () => SIPTrunkInfo_TrunkKind,
    SIPUri: () => SIPUri,
    SegmentedFileOutput: () => SegmentedFileOutput,
    SegmentedFileProtocol: () => SegmentedFileProtocol,
    SegmentedFileSuffix: () => SegmentedFileSuffix,
    SegmentsInfo: () => SegmentsInfo,
    SendDataRequest: () => SendDataRequest,
    SendDataResponse: () => SendDataResponse,
    ServerInfo: () => ServerInfo,
    ServerInfo_Edition: () => ServerInfo_Edition,
    ServerMessage: () => ServerMessage,
    SessionDescription: () => SessionDescription,
    SignalRequest: () => SignalRequest,
    SignalResponse: () => SignalResponse,
    SignalTarget: () => SignalTarget,
    SimulateJobRequest: () => SimulateJobRequest,
    SimulateScenario: () => SimulateScenario,
    SimulcastCodec: () => SimulcastCodec,
    SimulcastCodecInfo: () => SimulcastCodecInfo,
    SipDTMF: () => SipDTMF,
    SpeakerInfo: () => SpeakerInfo,
    SpeakersChanged: () => SpeakersChanged,
    StopEgressRequest: () => StopEgressRequest,
    StreamInfo: () => StreamInfo,
    StreamInfoList: () => StreamInfoList,
    StreamInfo_Status: () => StreamInfo_Status,
    StreamOutput: () => StreamOutput,
    StreamProtocol: () => StreamProtocol,
    StreamState: () => StreamState,
    StreamStateInfo: () => StreamStateInfo,
    StreamStateUpdate: () => StreamStateUpdate,
    SubscribedAudioCodec: () => SubscribedAudioCodec,
    SubscribedAudioCodecUpdate: () => SubscribedAudioCodecUpdate,
    SubscribedCodec: () => SubscribedCodec,
    SubscribedQuality: () => SubscribedQuality,
    SubscribedQualityUpdate: () => SubscribedQualityUpdate,
    SubscriptionError: () => SubscriptionError,
    SubscriptionPermission: () => SubscriptionPermission,
    SubscriptionPermissionUpdate: () => SubscriptionPermissionUpdate,
    SubscriptionResponse: () => SubscriptionResponse,
    SyncState: () => SyncState,
    TimeSeriesMetric: () => TimeSeriesMetric,
    TimedVersion: () => TimedVersion,
    TokenPagination: () => TokenPagination,
    TokenSourceRequest: () => TokenSourceRequest,
    TokenSourceResponse: () => TokenSourceResponse,
    TrackCompositeEgressRequest: () => TrackCompositeEgressRequest,
    TrackEgressRequest: () => TrackEgressRequest,
    TrackInfo: () => TrackInfo,
    TrackPermission: () => TrackPermission,
    TrackPublishedResponse: () => TrackPublishedResponse,
    TrackSource: () => TrackSource,
    TrackSubscribed: () => TrackSubscribed,
    TrackType: () => TrackType,
    TrackUnpublishedResponse: () => TrackUnpublishedResponse,
    Transcription: () => Transcription,
    TranscriptionSegment: () => TranscriptionSegment,
    TransferSIPParticipantRequest: () => TransferSIPParticipantRequest,
    TrickleRequest: () => TrickleRequest,
    UnpublishDataTrackRequest: () => UnpublishDataTrackRequest,
    UnpublishDataTrackResponse: () => UnpublishDataTrackResponse,
    UpdateDataSubscription: () => UpdateDataSubscription,
    UpdateDataSubscription_Update: () => UpdateDataSubscription_Update,
    UpdateIngressRequest: () => UpdateIngressRequest,
    UpdateJobStatus: () => UpdateJobStatus,
    UpdateLayoutRequest: () => UpdateLayoutRequest,
    UpdateLocalAudioTrack: () => UpdateLocalAudioTrack,
    UpdateLocalVideoTrack: () => UpdateLocalVideoTrack,
    UpdateParticipantMetadata: () => UpdateParticipantMetadata,
    UpdateParticipantRequest: () => UpdateParticipantRequest,
    UpdateRoomMetadataRequest: () => UpdateRoomMetadataRequest,
    UpdateSIPDispatchRuleRequest: () => UpdateSIPDispatchRuleRequest,
    UpdateSIPInboundTrunkRequest: () => UpdateSIPInboundTrunkRequest,
    UpdateSIPOutboundTrunkRequest: () => UpdateSIPOutboundTrunkRequest,
    UpdateStreamRequest: () => UpdateStreamRequest,
    UpdateSubscription: () => UpdateSubscription,
    UpdateSubscriptionsRequest: () => UpdateSubscriptionsRequest,
    UpdateSubscriptionsResponse: () => UpdateSubscriptionsResponse,
    UpdateTrackSettings: () => UpdateTrackSettings,
    UpdateVideoLayers: () => UpdateVideoLayers,
    UpdateWorkerStatus: () => UpdateWorkerStatus,
    UserPacket: () => UserPacket,
    VP8MungerState: () => VP8MungerState,
    VideoCodec: () => VideoCodec,
    VideoConfiguration: () => VideoConfiguration,
    VideoLayer: () => VideoLayer,
    VideoLayer_Mode: () => VideoLayer_Mode,
    VideoQuality: () => VideoQuality,
    WebEgressRequest: () => WebEgressRequest,
    WebhookConfig: () => WebhookConfig,
    WebhookEvent: () => WebhookEvent,
    WhatsAppCall: () => WhatsAppCall,
    WhatsAppCallDirection: () => WhatsAppCallDirection,
    WorkerMessage: () => WorkerMessage,
    WorkerPing: () => WorkerPing,
    WorkerPong: () => WorkerPong,
    WorkerStatus: () => WorkerStatus,
    WrappedJoinRequest: () => WrappedJoinRequest,
    WrappedJoinRequest_Compression: () => WrappedJoinRequest_Compression,
    protoInt64: () => protoInt64,
    version: () => version
  });

  // node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }
  var FLOAT32_MAX = 34028234663852886e22;
  var FLOAT32_MIN = -34028234663852886e22;
  var UINT32_MAX = 4294967295;
  var INT32_MAX = 2147483647;
  var INT32_MIN = -2147483648;
  function assertInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid int 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
      throw new Error("invalid int 32: " + arg);
  }
  function assertUInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid uint 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
      throw new Error("invalid uint 32: " + arg);
  }
  function assertFloat32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid float 32: " + typeof arg);
    if (!Number.isFinite(arg))
      return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
      throw new Error("invalid float 32: " + arg);
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
  var enumTypeSymbol = /* @__PURE__ */ Symbol("@bufbuild/protobuf/enum-type");
  function getEnumType(enumObject) {
    const t = enumObject[enumTypeSymbol];
    assert(t, "missing enum type on enum object");
    return t;
  }
  function setEnumType(enumObject, typeName, values, opt) {
    enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v) => ({
      no: v.no,
      name: v.name,
      localName: enumObject[v.no]
    })), opt);
  }
  function makeEnumType(typeName, values, _opt) {
    const names = /* @__PURE__ */ Object.create(null);
    const numbers = /* @__PURE__ */ Object.create(null);
    const normalValues = [];
    for (const value of values) {
      const n = normalizeEnumValue(value);
      normalValues.push(n);
      names[value.name] = n;
      numbers[value.no] = n;
    }
    return {
      typeName,
      values: normalValues,
      // We do not surface options at this time
      // options: opt?.options ?? Object.create(null),
      findName(name) {
        return names[name];
      },
      findNumber(no) {
        return numbers[no];
      }
    };
  }
  function makeEnum(typeName, values, opt) {
    const enumObject = {};
    for (const value of values) {
      const n = normalizeEnumValue(value);
      enumObject[n.localName] = n.no;
      enumObject[n.no] = n.localName;
    }
    setEnumType(enumObject, typeName, values, opt);
    return enumObject;
  }
  function normalizeEnumValue(value) {
    if ("localName" in value) {
      return value;
    }
    return Object.assign(Object.assign({}, value), { localName: value.name });
  }

  // node_modules/@bufbuild/protobuf/dist/esm/message.js
  var Message = class {
    /**
     * Compare with a message of the same type.
     * Note that this function disregards extensions and unknown fields.
     */
    equals(other) {
      return this.getType().runtime.util.equals(this.getType(), this, other);
    }
    /**
     * Create a deep copy.
     */
    clone() {
      return this.getType().runtime.util.clone(this);
    }
    /**
     * Parse from binary data, merging fields.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    fromBinary(bytes, options) {
      const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
      format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
      return this;
    }
    /**
     * Parse a message from a JSON value.
     */
    fromJson(jsonValue, options) {
      const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
      format.readMessage(type, jsonValue, opt, this);
      return this;
    }
    /**
     * Parse a message from a JSON string.
     */
    fromJsonString(jsonString, options) {
      let json;
      try {
        json = JSON.parse(jsonString);
      } catch (e) {
        throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
      }
      return this.fromJson(json, options);
    }
    /**
     * Serialize the message to binary data.
     */
    toBinary(options) {
      const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
      bin.writeMessage(this, writer, opt);
      return writer.finish();
    }
    /**
     * Serialize the message to a JSON value, a JavaScript value that can be
     * passed to JSON.stringify().
     */
    toJson(options) {
      const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
      return json.writeMessage(this, opt);
    }
    /**
     * Serialize the message to a JSON string.
     */
    toJsonString(options) {
      var _a;
      const value = this.toJson(options);
      return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Override for serialization behavior. This will be invoked when calling
     * JSON.stringify on this message (i.e. JSON.stringify(msg)).
     *
     * Note that this will not serialize google.protobuf.Any with a packed
     * message because the protobuf JSON format specifies that it needs to be
     * unpacked, and this is only possible with a type registry to look up the
     * message type.  As a result, attempting to serialize a message with this
     * type will throw an Error.
     *
     * This method is protected because you should not need to invoke it
     * directly -- instead use JSON.stringify or toJsonString for
     * stringified JSON.  Alternatively, if actual JSON is desired, you should
     * use toJson.
     */
    toJSON() {
      return this.toJson({
        emitDefaultValues: true
      });
    }
    /**
     * Retrieve the MessageType of this message - a singleton that represents
     * the protobuf message declaration and provides metadata for reflection-
     * based operations.
     */
    getType() {
      return Object.getPrototypeOf(this).constructor;
    }
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
  function makeMessageType(runtime, typeName, fields, opt) {
    var _a;
    const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
    const type = {
      [localName]: function(data) {
        runtime.util.initFields(this);
        runtime.util.initPartial(data, this);
      }
    }[localName];
    Object.setPrototypeOf(type.prototype, new Message());
    Object.assign(type, {
      runtime,
      typeName,
      fields: runtime.util.newFieldList(fields),
      fromBinary(bytes, options) {
        return new type().fromBinary(bytes, options);
      },
      fromJson(jsonValue, options) {
        return new type().fromJson(jsonValue, options);
      },
      fromJsonString(jsonString, options) {
        return new type().fromJsonString(jsonString, options);
      },
      equals(a, b) {
        return runtime.util.equals(type, a, b);
      }
    });
    return type;
  }

  // node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
  function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for (let shift = 0; shift < 28; shift += 7) {
      let b = this.buf[this.pos++];
      lowBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    let middleByte = this.buf[this.pos++];
    lowBits |= (middleByte & 15) << 28;
    highBits = (middleByte & 112) >> 4;
    if ((middleByte & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
    for (let shift = 3; shift <= 31; shift += 7) {
      let b = this.buf[this.pos++];
      highBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    throw new Error("invalid varint");
  }
  function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
      const shift = lo >>> i;
      const hasNext = !(shift >>> 7 == 0 && hi == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
    const hasMoreBits = !(hi >> 3 == 0);
    bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
    if (!hasMoreBits) {
      return;
    }
    for (let i = 3; i < 31; i = i + 7) {
      const shift = hi >>> i;
      const hasNext = !(shift >>> 7 == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    bytes.push(hi >>> 31 & 1);
  }
  var TWO_PWR_32_DBL = 4294967296;
  function int64FromString(dec) {
    const minus = dec[0] === "-";
    if (minus) {
      dec = dec.slice(1);
    }
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
      const digit1e6 = Number(dec.slice(begin, end));
      highBits *= base;
      lowBits = lowBits * base + digit1e6;
      if (lowBits >= TWO_PWR_32_DBL) {
        highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
        lowBits = lowBits % TWO_PWR_32_DBL;
      }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
  }
  function int64ToString(lo, hi) {
    let bits = newBits(lo, hi);
    const negative = bits.hi & 2147483648;
    if (negative) {
      bits = negate(bits.lo, bits.hi);
    }
    const result = uInt64ToString(bits.lo, bits.hi);
    return negative ? "-" + result : result;
  }
  function uInt64ToString(lo, hi) {
    ({ lo, hi } = toUnsigned(lo, hi));
    if (hi <= 2097151) {
      return String(TWO_PWR_32_DBL * hi + lo);
    }
    const low = lo & 16777215;
    const mid = (lo >>> 24 | hi << 8) & 16777215;
    const high = hi >> 16 & 65535;
    let digitA = low + mid * 6777216 + high * 6710656;
    let digitB = mid + high * 8147497;
    let digitC = high * 2;
    const base = 1e7;
    if (digitA >= base) {
      digitB += Math.floor(digitA / base);
      digitA %= base;
    }
    if (digitB >= base) {
      digitC += Math.floor(digitB / base);
      digitB %= base;
    }
    return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
  }
  function toUnsigned(lo, hi) {
    return { lo: lo >>> 0, hi: hi >>> 0 };
  }
  function newBits(lo, hi) {
    return { lo: lo | 0, hi: hi | 0 };
  }
  function negate(lowBits, highBits) {
    highBits = ~highBits;
    if (lowBits) {
      lowBits = ~lowBits + 1;
    } else {
      highBits += 1;
    }
    return newBits(lowBits, highBits);
  }
  var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
    const partial = String(digit1e7);
    return "0000000".slice(partial.length) + partial;
  };
  function varint32write(value, bytes) {
    if (value >= 0) {
      while (value > 127) {
        bytes.push(value & 127 | 128);
        value = value >>> 7;
      }
      bytes.push(value);
    } else {
      for (let i = 0; i < 9; i++) {
        bytes.push(value & 127 | 128);
        value = value >> 7;
      }
      bytes.push(1);
    }
  }
  function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 127;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 7;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 14;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 21;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 15) << 28;
    for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
      b = this.buf[this.pos++];
    if ((b & 128) != 0)
      throw new Error("invalid varint");
    this.assertBounds();
    return result >>> 0;
  }

  // node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
  function makeInt64Support() {
    const dv = new DataView(new ArrayBuffer(8));
    const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
    if (ok) {
      const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
      return {
        zero: BigInt(0),
        supported: true,
        parse(value) {
          const bi = typeof value == "bigint" ? value : BigInt(value);
          if (bi > MAX || bi < MIN) {
            throw new Error(`int64 invalid: ${value}`);
          }
          return bi;
        },
        uParse(value) {
          const bi = typeof value == "bigint" ? value : BigInt(value);
          if (bi > UMAX || bi < UMIN) {
            throw new Error(`uint64 invalid: ${value}`);
          }
          return bi;
        },
        enc(value) {
          dv.setBigInt64(0, this.parse(value), true);
          return {
            lo: dv.getInt32(0, true),
            hi: dv.getInt32(4, true)
          };
        },
        uEnc(value) {
          dv.setBigInt64(0, this.uParse(value), true);
          return {
            lo: dv.getInt32(0, true),
            hi: dv.getInt32(4, true)
          };
        },
        dec(lo, hi) {
          dv.setInt32(0, lo, true);
          dv.setInt32(4, hi, true);
          return dv.getBigInt64(0, true);
        },
        uDec(lo, hi) {
          dv.setInt32(0, lo, true);
          dv.setInt32(4, hi, true);
          return dv.getBigUint64(0, true);
        }
      };
    }
    const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
    const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
    return {
      zero: "0",
      supported: false,
      parse(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertInt64String(value);
        return value;
      },
      uParse(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertUInt64String(value);
        return value;
      },
      enc(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertInt64String(value);
        return int64FromString(value);
      },
      uEnc(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertUInt64String(value);
        return int64FromString(value);
      },
      dec(lo, hi) {
        return int64ToString(lo, hi);
      },
      uDec(lo, hi) {
        return uInt64ToString(lo, hi);
      }
    };
  }
  var protoInt64 = makeInt64Support();

  // node_modules/@bufbuild/protobuf/dist/esm/scalar.js
  var ScalarType;
  (function(ScalarType2) {
    ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
    ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
    ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
    ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
    ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
    ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
    ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
    ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
    ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
    ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
    ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
    ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
    ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
    ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
    ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
  })(ScalarType || (ScalarType = {}));
  var LongType;
  (function(LongType2) {
    LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
    LongType2[LongType2["STRING"] = 1] = "STRING";
  })(LongType || (LongType = {}));

  // node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
  function scalarEquals(type, a, b) {
    if (a === b) {
      return true;
    }
    if (type == ScalarType.BYTES) {
      if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    switch (type) {
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return a == b;
    }
    return false;
  }
  function scalarZeroValue(type, longType) {
    switch (type) {
      case ScalarType.BOOL:
        return false;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return longType == 0 ? protoInt64.zero : "0";
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        return 0;
      case ScalarType.BYTES:
        return new Uint8Array(0);
      case ScalarType.STRING:
        return "";
      default:
        return 0;
    }
  }
  function isScalarZeroValue(type, value) {
    switch (type) {
      case ScalarType.BOOL:
        return value === false;
      case ScalarType.STRING:
        return value === "";
      case ScalarType.BYTES:
        return value instanceof Uint8Array && !value.byteLength;
      default:
        return value == 0;
    }
  }

  // node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
  var WireType;
  (function(WireType2) {
    WireType2[WireType2["Varint"] = 0] = "Varint";
    WireType2[WireType2["Bit64"] = 1] = "Bit64";
    WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
    WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
    WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
    WireType2[WireType2["Bit32"] = 5] = "Bit32";
  })(WireType || (WireType = {}));
  var BinaryWriter = class {
    constructor(textEncoder) {
      this.stack = [];
      this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
      this.chunks = [];
      this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let len = 0;
      for (let i = 0; i < this.chunks.length; i++)
        len += this.chunks[i].length;
      let bytes = new Uint8Array(len);
      let offset = 0;
      for (let i = 0; i < this.chunks.length; i++) {
        bytes.set(this.chunks[i], offset);
        offset += this.chunks[i].length;
      }
      this.chunks = [];
      return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
      this.stack.push({ chunks: this.chunks, buf: this.buf });
      this.chunks = [];
      this.buf = [];
      return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
      let chunk = this.finish();
      let prev = this.stack.pop();
      if (!prev)
        throw new Error("invalid state, fork stack empty");
      this.chunks = prev.chunks;
      this.buf = prev.buf;
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
      return this.uint32((fieldNo << 3 | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
      if (this.buf.length) {
        this.chunks.push(new Uint8Array(this.buf));
        this.buf = [];
      }
      this.chunks.push(chunk);
      return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
      assertUInt32(value);
      while (value > 127) {
        this.buf.push(value & 127 | 128);
        value = value >>> 7;
      }
      this.buf.push(value);
      return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
      assertInt32(value);
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
      this.buf.push(value ? 1 : 0);
      return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
      this.uint32(value.byteLength);
      return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
      let chunk = this.textEncoder.encode(value);
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
      assertFloat32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setFloat32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
      let chunk = new Uint8Array(8);
      new DataView(chunk.buffer).setFloat64(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
      assertUInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setUint32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
      assertInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setInt32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
      assertInt32(value);
      value = (value << 1 ^ value >> 31) >>> 0;
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
      let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
      view.setInt32(0, tc.lo, true);
      view.setInt32(4, tc.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
      let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
      view.setInt32(0, tc.lo, true);
      view.setInt32(4, tc.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
      let tc = protoInt64.enc(value);
      varint64write(tc.lo, tc.hi, this.buf);
      return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
      let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
      varint64write(lo, hi, this.buf);
      return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
      let tc = protoInt64.uEnc(value);
      varint64write(tc.lo, tc.hi, this.buf);
      return this;
    }
  };
  var BinaryReader = class {
    constructor(buf, textDecoder) {
      this.varint64 = varint64read;
      this.uint32 = varint32read;
      this.buf = buf;
      this.len = buf.length;
      this.pos = 0;
      this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
      let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
      if (fieldNo <= 0 || wireType < 0 || wireType > 5)
        throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
      return [fieldNo, wireType];
    }
    /**
     * Skip one element and return the skipped data.
     *
     * When skipping StartGroup, provide the tags field number to check for
     * matching field number in the EndGroup tag.
     */
    skip(wireType, fieldNo) {
      let start = this.pos;
      switch (wireType) {
        case WireType.Varint:
          while (this.buf[this.pos++] & 128) {
          }
          break;
        // eslint-disable-next-line
        // @ts-ignore TS7029: Fallthrough case in switch
        case WireType.Bit64:
          this.pos += 4;
        // eslint-disable-next-line
        // @ts-ignore TS7029: Fallthrough case in switch
        case WireType.Bit32:
          this.pos += 4;
          break;
        case WireType.LengthDelimited:
          let len = this.uint32();
          this.pos += len;
          break;
        case WireType.StartGroup:
          for (; ; ) {
            const [fn, wt] = this.tag();
            if (wt === WireType.EndGroup) {
              if (fieldNo !== void 0 && fn !== fieldNo) {
                throw new Error("invalid end group tag");
              }
              break;
            }
            this.skip(wt, fn);
          }
          break;
        default:
          throw new Error("cant skip wire type " + wireType);
      }
      this.assertBounds();
      return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
      if (this.pos > this.len)
        throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
      return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
      let zze = this.uint32();
      return zze >>> 1 ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
      return protoInt64.dec(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
      return protoInt64.uDec(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
      let [lo, hi] = this.varint64();
      let s = -(lo & 1);
      lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
      hi = hi >>> 1 ^ s;
      return protoInt64.dec(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
      let [lo, hi] = this.varint64();
      return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
      return protoInt64.uDec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
      return protoInt64.dec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
      let len = this.uint32(), start = this.pos;
      this.pos += len;
      this.assertBounds();
      return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/extensions.js
  function makeExtension(runtime, typeName, extendee, field) {
    let fi;
    return {
      typeName,
      extendee,
      get field() {
        if (!fi) {
          const i = typeof field == "function" ? field() : field;
          i.name = typeName.split(".").pop();
          i.jsonName = `[${typeName}]`;
          fi = runtime.util.newFieldList([i]).list()[0];
        }
        return fi;
      },
      runtime
    };
  }
  function createExtensionContainer(extension) {
    const localName = extension.field.localName;
    const container = /* @__PURE__ */ Object.create(null);
    container[localName] = initExtensionField(extension);
    return [container, () => container[localName]];
  }
  function initExtensionField(ext) {
    const field = ext.field;
    if (field.repeated) {
      return [];
    }
    if (field.default !== void 0) {
      return field.default;
    }
    switch (field.kind) {
      case "enum":
        return field.T.values[0].no;
      case "scalar":
        return scalarZeroValue(field.T, field.L);
      case "message":
        const T = field.T, value = new T();
        return T.fieldWrapper ? T.fieldWrapper.unwrapField(value) : value;
      case "map":
        throw "map fields are not allowed to be extensions";
    }
  }
  function filterUnknownFields(unknownFields, field) {
    if (!field.repeated && (field.kind == "enum" || field.kind == "scalar")) {
      for (let i = unknownFields.length - 1; i >= 0; --i) {
        if (unknownFields[i].no == field.no) {
          return [unknownFields[i]];
        }
      }
      return [];
    }
    return unknownFields.filter((uf) => uf.no === field.no);
  }

  // node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
  var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  var decTable = [];
  for (let i = 0; i < encTable.length; i++)
    decTable[encTable[i].charCodeAt(0)] = i;
  decTable["-".charCodeAt(0)] = encTable.indexOf("+");
  decTable["_".charCodeAt(0)] = encTable.indexOf("/");
  var protoBase64 = {
    /**
     * Decodes a base64 string to a byte array.
     *
     * - ignores white-space, including line breaks and tabs
     * - allows inner padding (can decode concatenated base64 strings)
     * - does not require padding
     * - understands base64url encoding:
     *   "-" instead of "+",
     *   "_" instead of "/",
     *   no padding
     */
    dec(base64Str) {
      let es = base64Str.length * 3 / 4;
      if (base64Str[base64Str.length - 2] == "=")
        es -= 2;
      else if (base64Str[base64Str.length - 1] == "=")
        es -= 1;
      let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
      for (let i = 0; i < base64Str.length; i++) {
        b = decTable[base64Str.charCodeAt(i)];
        if (b === void 0) {
          switch (base64Str[i]) {
            // @ts-ignore TS7029: Fallthrough case in switch
            case "=":
              groupPos = 0;
            // reset state when padding found
            // @ts-ignore TS7029: Fallthrough case in switch
            case "\n":
            case "\r":
            case "	":
            case " ":
              continue;
            // skip white-space, and padding
            default:
              throw Error("invalid base64 string.");
          }
        }
        switch (groupPos) {
          case 0:
            p = b;
            groupPos = 1;
            break;
          case 1:
            bytes[bytePos++] = p << 2 | (b & 48) >> 4;
            p = b;
            groupPos = 2;
            break;
          case 2:
            bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
            p = b;
            groupPos = 3;
            break;
          case 3:
            bytes[bytePos++] = (p & 3) << 6 | b;
            groupPos = 0;
            break;
        }
      }
      if (groupPos == 1)
        throw Error("invalid base64 string.");
      return bytes.subarray(0, bytePos);
    },
    /**
     * Encode a byte array to a base64 string.
     */
    enc(bytes) {
      let base64 = "", groupPos = 0, b, p = 0;
      for (let i = 0; i < bytes.length; i++) {
        b = bytes[i];
        switch (groupPos) {
          case 0:
            base64 += encTable[b >> 2];
            p = (b & 3) << 4;
            groupPos = 1;
            break;
          case 1:
            base64 += encTable[p | b >> 4];
            p = (b & 15) << 2;
            groupPos = 2;
            break;
          case 2:
            base64 += encTable[p | b >> 6];
            base64 += encTable[b & 63];
            groupPos = 0;
            break;
        }
      }
      if (groupPos) {
        base64 += encTable[p];
        base64 += "=";
        if (groupPos == 1)
          base64 += "=";
      }
      return base64;
    }
  };

  // node_modules/@bufbuild/protobuf/dist/esm/extension-accessor.js
  function getExtension(message, extension, options) {
    assertExtendee(extension, message);
    const opt = extension.runtime.bin.makeReadOptions(options);
    const ufs = filterUnknownFields(message.getType().runtime.bin.listUnknownFields(message), extension.field);
    const [container, get] = createExtensionContainer(extension);
    for (const uf of ufs) {
      extension.runtime.bin.readField(container, opt.readerFactory(uf.data), extension.field, uf.wireType, opt);
    }
    return get();
  }
  function setExtension(message, extension, value, options) {
    assertExtendee(extension, message);
    const readOpt = extension.runtime.bin.makeReadOptions(options);
    const writeOpt = extension.runtime.bin.makeWriteOptions(options);
    if (hasExtension(message, extension)) {
      const ufs = message.getType().runtime.bin.listUnknownFields(message).filter((uf) => uf.no != extension.field.no);
      message.getType().runtime.bin.discardUnknownFields(message);
      for (const uf of ufs) {
        message.getType().runtime.bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
      }
    }
    const writer = writeOpt.writerFactory();
    let f = extension.field;
    if (!f.opt && !f.repeated && (f.kind == "enum" || f.kind == "scalar")) {
      f = Object.assign(Object.assign({}, extension.field), { opt: true });
    }
    extension.runtime.bin.writeField(f, value, writer, writeOpt);
    const reader = readOpt.readerFactory(writer.finish());
    while (reader.pos < reader.len) {
      const [no, wireType] = reader.tag();
      const data = reader.skip(wireType, no);
      message.getType().runtime.bin.onUnknownField(message, no, wireType, data);
    }
  }
  function hasExtension(message, extension) {
    const messageType = message.getType();
    return extension.extendee.typeName === messageType.typeName && !!messageType.runtime.bin.listUnknownFields(message).find((uf) => uf.no == extension.field.no);
  }
  function assertExtendee(extension, message) {
    assert(extension.extendee.typeName == message.getType().typeName, `extension ${extension.typeName} can only be applied to message ${extension.extendee.typeName}`);
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/reflect.js
  function isFieldSet(field, target) {
    const localName = field.localName;
    if (field.repeated) {
      return target[localName].length > 0;
    }
    if (field.oneof) {
      return target[field.oneof.localName].case === localName;
    }
    switch (field.kind) {
      case "enum":
      case "scalar":
        if (field.opt || field.req) {
          return target[localName] !== void 0;
        }
        if (field.kind == "enum") {
          return target[localName] !== field.T.values[0].no;
        }
        return !isScalarZeroValue(field.T, target[localName]);
      case "message":
        return target[localName] !== void 0;
      case "map":
        return Object.keys(target[localName]).length > 0;
    }
  }
  function clearField(field, target) {
    const localName = field.localName;
    const implicitPresence = !field.opt && !field.req;
    if (field.repeated) {
      target[localName] = [];
    } else if (field.oneof) {
      target[field.oneof.localName] = { case: void 0 };
    } else {
      switch (field.kind) {
        case "map":
          target[localName] = {};
          break;
        case "enum":
          target[localName] = implicitPresence ? field.T.values[0].no : void 0;
          break;
        case "scalar":
          target[localName] = implicitPresence ? scalarZeroValue(field.T, field.L) : void 0;
          break;
        case "message":
          target[localName] = void 0;
          break;
      }
    }
  }

  // node_modules/@bufbuild/protobuf/dist/esm/is-message.js
  function isMessage(arg, type) {
    if (arg === null || typeof arg != "object") {
      return false;
    }
    if (!Object.getOwnPropertyNames(Message.prototype).every((m) => m in arg && typeof arg[m] == "function")) {
      return false;
    }
    const actualType = arg.getType();
    if (actualType === null || typeof actualType != "function" || !("typeName" in actualType) || typeof actualType.typeName != "string") {
      return false;
    }
    return type === void 0 ? true : actualType.typeName == type.typeName;
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
  function wrapField(type, value) {
    if (isMessage(value) || !type.fieldWrapper) {
      return value;
    }
    return type.fieldWrapper.wrapField(value);
  }
  var wktWrapperToScalarType = {
    "google.protobuf.DoubleValue": ScalarType.DOUBLE,
    "google.protobuf.FloatValue": ScalarType.FLOAT,
    "google.protobuf.Int64Value": ScalarType.INT64,
    "google.protobuf.UInt64Value": ScalarType.UINT64,
    "google.protobuf.Int32Value": ScalarType.INT32,
    "google.protobuf.UInt32Value": ScalarType.UINT32,
    "google.protobuf.BoolValue": ScalarType.BOOL,
    "google.protobuf.StringValue": ScalarType.STRING,
    "google.protobuf.BytesValue": ScalarType.BYTES
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/json-format.js
  var jsonReadDefaults = {
    ignoreUnknownFields: false
  };
  var jsonWriteDefaults = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0
  };
  function makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
  }
  function makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
  }
  var tokenNull = /* @__PURE__ */ Symbol();
  var tokenIgnoredUnknownEnum = /* @__PURE__ */ Symbol();
  function makeJsonFormat() {
    return {
      makeReadOptions,
      makeWriteOptions,
      readMessage(type, json, options, message) {
        if (json == null || Array.isArray(json) || typeof json != "object") {
          throw new Error(`cannot decode message ${type.typeName} from JSON: ${debugJsonValue(json)}`);
        }
        message = message !== null && message !== void 0 ? message : new type();
        const oneofSeen = /* @__PURE__ */ new Map();
        const registry = options.typeRegistry;
        for (const [jsonKey, jsonValue] of Object.entries(json)) {
          const field = type.fields.findJsonName(jsonKey);
          if (field) {
            if (field.oneof) {
              if (jsonValue === null && field.kind == "scalar") {
                continue;
              }
              const seen = oneofSeen.get(field.oneof);
              if (seen !== void 0) {
                throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
              }
              oneofSeen.set(field.oneof, jsonKey);
            }
            readField(message, jsonValue, field, options, type);
          } else {
            let found = false;
            if ((registry === null || registry === void 0 ? void 0 : registry.findExtension) && jsonKey.startsWith("[") && jsonKey.endsWith("]")) {
              const ext = registry.findExtension(jsonKey.substring(1, jsonKey.length - 1));
              if (ext && ext.extendee.typeName == type.typeName) {
                found = true;
                const [container, get] = createExtensionContainer(ext);
                readField(container, jsonValue, ext.field, options, ext);
                setExtension(message, ext, get(), options);
              }
            }
            if (!found && !options.ignoreUnknownFields) {
              throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
            }
          }
        }
        return message;
      },
      writeMessage(message, options) {
        const type = message.getType();
        const json = {};
        let field;
        try {
          for (field of type.fields.byNumber()) {
            if (!isFieldSet(field, message)) {
              if (field.req) {
                throw `required field not set`;
              }
              if (!options.emitDefaultValues) {
                continue;
              }
              if (!canEmitFieldDefaultValue(field)) {
                continue;
              }
            }
            const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
            const jsonValue = writeField(field, value, options);
            if (jsonValue !== void 0) {
              json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
            }
          }
          const registry = options.typeRegistry;
          if (registry === null || registry === void 0 ? void 0 : registry.findExtensionFor) {
            for (const uf of type.runtime.bin.listUnknownFields(message)) {
              const ext = registry.findExtensionFor(type.typeName, uf.no);
              if (ext && hasExtension(message, ext)) {
                const value = getExtension(message, ext, options);
                const jsonValue = writeField(ext.field, value, options);
                if (jsonValue !== void 0) {
                  json[ext.field.jsonName] = jsonValue;
                }
              }
            }
          }
        } catch (e) {
          const m = field ? `cannot encode field ${type.typeName}.${field.name} to JSON` : `cannot encode message ${type.typeName} to JSON`;
          const r = e instanceof Error ? e.message : String(e);
          throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
        }
        return json;
      },
      readScalar(type, json, longType) {
        return readScalar(type, json, longType !== null && longType !== void 0 ? longType : LongType.BIGINT, true);
      },
      writeScalar(type, value, emitDefaultValues) {
        if (value === void 0) {
          return void 0;
        }
        if (emitDefaultValues || isScalarZeroValue(type, value)) {
          return writeScalar(type, value);
        }
        return void 0;
      },
      debug: debugJsonValue
    };
  }
  function debugJsonValue(json) {
    if (json === null) {
      return "null";
    }
    switch (typeof json) {
      case "object":
        return Array.isArray(json) ? "array" : "object";
      case "string":
        return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
      default:
        return String(json);
    }
  }
  function readField(target, jsonValue, field, options, parentType) {
    let localName = field.localName;
    if (field.repeated) {
      assert(field.kind != "map");
      if (jsonValue === null) {
        return;
      }
      if (!Array.isArray(jsonValue)) {
        throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
      }
      const targetArray = target[localName];
      for (const jsonItem of jsonValue) {
        if (jsonItem === null) {
          throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`);
        }
        switch (field.kind) {
          case "message":
            targetArray.push(field.T.fromJson(jsonItem, options));
            break;
          case "enum":
            const enumValue = readEnum(field.T, jsonItem, options.ignoreUnknownFields, true);
            if (enumValue !== tokenIgnoredUnknownEnum) {
              targetArray.push(enumValue);
            }
            break;
          case "scalar":
            try {
              targetArray.push(readScalar(field.T, jsonItem, field.L, true));
            } catch (e) {
              let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`;
              if (e instanceof Error && e.message.length > 0) {
                m += `: ${e.message}`;
              }
              throw new Error(m);
            }
            break;
        }
      }
    } else if (field.kind == "map") {
      if (jsonValue === null) {
        return;
      }
      if (typeof jsonValue != "object" || Array.isArray(jsonValue)) {
        throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
      }
      const targetMap = target[localName];
      for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
        if (jsonMapValue === null) {
          throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: map value null`);
        }
        let key;
        try {
          key = readMapKey(field.K, jsonMapKey);
        } catch (e) {
          let m = `cannot decode map key for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
          if (e instanceof Error && e.message.length > 0) {
            m += `: ${e.message}`;
          }
          throw new Error(m);
        }
        switch (field.V.kind) {
          case "message":
            targetMap[key] = field.V.T.fromJson(jsonMapValue, options);
            break;
          case "enum":
            const enumValue = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields, true);
            if (enumValue !== tokenIgnoredUnknownEnum) {
              targetMap[key] = enumValue;
            }
            break;
          case "scalar":
            try {
              targetMap[key] = readScalar(field.V.T, jsonMapValue, LongType.BIGINT, true);
            } catch (e) {
              let m = `cannot decode map value for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
              if (e instanceof Error && e.message.length > 0) {
                m += `: ${e.message}`;
              }
              throw new Error(m);
            }
            break;
        }
      }
    } else {
      if (field.oneof) {
        target = target[field.oneof.localName] = { case: localName };
        localName = "value";
      }
      switch (field.kind) {
        case "message":
          const messageType = field.T;
          if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
            return;
          }
          let currentValue = target[localName];
          if (isMessage(currentValue)) {
            currentValue.fromJson(jsonValue, options);
          } else {
            target[localName] = currentValue = messageType.fromJson(jsonValue, options);
            if (messageType.fieldWrapper && !field.oneof) {
              target[localName] = messageType.fieldWrapper.unwrapField(currentValue);
            }
          }
          break;
        case "enum":
          const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields, false);
          switch (enumValue) {
            case tokenNull:
              clearField(field, target);
              break;
            case tokenIgnoredUnknownEnum:
              break;
            default:
              target[localName] = enumValue;
              break;
          }
          break;
        case "scalar":
          try {
            const scalarValue = readScalar(field.T, jsonValue, field.L, false);
            switch (scalarValue) {
              case tokenNull:
                clearField(field, target);
                break;
              default:
                target[localName] = scalarValue;
                break;
            }
          } catch (e) {
            let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
            if (e instanceof Error && e.message.length > 0) {
              m += `: ${e.message}`;
            }
            throw new Error(m);
          }
          break;
      }
    }
  }
  function readMapKey(type, json) {
    if (type === ScalarType.BOOL) {
      switch (json) {
        case "true":
          json = true;
          break;
        case "false":
          json = false;
          break;
      }
    }
    return readScalar(type, json, LongType.BIGINT, true).toString();
  }
  function readScalar(type, json, longType, nullAsZeroValue) {
    if (json === null) {
      if (nullAsZeroValue) {
        return scalarZeroValue(type, longType);
      }
      return tokenNull;
    }
    switch (type) {
      // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
      // Either numbers or strings are accepted. Exponent notation is also accepted.
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        if (json === "NaN")
          return Number.NaN;
        if (json === "Infinity")
          return Number.POSITIVE_INFINITY;
        if (json === "-Infinity")
          return Number.NEGATIVE_INFINITY;
        if (json === "") {
          break;
        }
        if (typeof json == "string" && json.trim().length !== json.length) {
          break;
        }
        if (typeof json != "string" && typeof json != "number") {
          break;
        }
        const float = Number(json);
        if (Number.isNaN(float)) {
          break;
        }
        if (!Number.isFinite(float)) {
          break;
        }
        if (type == ScalarType.FLOAT)
          assertFloat32(float);
        return float;
      // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
      case ScalarType.UINT32:
        let int32;
        if (typeof json == "number")
          int32 = json;
        else if (typeof json == "string" && json.length > 0) {
          if (json.trim().length === json.length)
            int32 = Number(json);
        }
        if (int32 === void 0)
          break;
        if (type == ScalarType.UINT32 || type == ScalarType.FIXED32)
          assertUInt32(int32);
        else
          assertInt32(int32);
        return int32;
      // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        if (typeof json != "number" && typeof json != "string")
          break;
        const long = protoInt64.parse(json);
        return longType ? long.toString() : long;
      case ScalarType.FIXED64:
      case ScalarType.UINT64:
        if (typeof json != "number" && typeof json != "string")
          break;
        const uLong = protoInt64.uParse(json);
        return longType ? uLong.toString() : uLong;
      // bool:
      case ScalarType.BOOL:
        if (typeof json !== "boolean")
          break;
        return json;
      // string:
      case ScalarType.STRING:
        if (typeof json !== "string") {
          break;
        }
        try {
          encodeURIComponent(json);
        } catch (e) {
          throw new Error("invalid UTF8");
        }
        return json;
      // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
      // Either standard or URL-safe base64 encoding with/without paddings are accepted.
      case ScalarType.BYTES:
        if (json === "")
          return new Uint8Array(0);
        if (typeof json !== "string")
          break;
        return protoBase64.dec(json);
    }
    throw new Error();
  }
  function readEnum(type, json, ignoreUnknownFields, nullAsZeroValue) {
    if (json === null) {
      if (type.typeName == "google.protobuf.NullValue") {
        return 0;
      }
      return nullAsZeroValue ? type.values[0].no : tokenNull;
    }
    switch (typeof json) {
      case "number":
        if (Number.isInteger(json)) {
          return json;
        }
        break;
      case "string":
        const value = type.findName(json);
        if (value !== void 0) {
          return value.no;
        }
        if (ignoreUnknownFields) {
          return tokenIgnoredUnknownEnum;
        }
        break;
    }
    throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
  }
  function canEmitFieldDefaultValue(field) {
    if (field.repeated || field.kind == "map") {
      return true;
    }
    if (field.oneof) {
      return false;
    }
    if (field.kind == "message") {
      return false;
    }
    if (field.opt || field.req) {
      return false;
    }
    return true;
  }
  function writeField(field, value, options) {
    if (field.kind == "map") {
      assert(typeof value == "object" && value != null);
      const jsonObj = {};
      const entries = Object.entries(value);
      switch (field.V.kind) {
        case "scalar":
          for (const [entryKey, entryValue] of entries) {
            jsonObj[entryKey.toString()] = writeScalar(field.V.T, entryValue);
          }
          break;
        case "message":
          for (const [entryKey, entryValue] of entries) {
            jsonObj[entryKey.toString()] = entryValue.toJson(options);
          }
          break;
        case "enum":
          const enumType = field.V.T;
          for (const [entryKey, entryValue] of entries) {
            jsonObj[entryKey.toString()] = writeEnum(enumType, entryValue, options.enumAsInteger);
          }
          break;
      }
      return options.emitDefaultValues || entries.length > 0 ? jsonObj : void 0;
    }
    if (field.repeated) {
      assert(Array.isArray(value));
      const jsonArr = [];
      switch (field.kind) {
        case "scalar":
          for (let i = 0; i < value.length; i++) {
            jsonArr.push(writeScalar(field.T, value[i]));
          }
          break;
        case "enum":
          for (let i = 0; i < value.length; i++) {
            jsonArr.push(writeEnum(field.T, value[i], options.enumAsInteger));
          }
          break;
        case "message":
          for (let i = 0; i < value.length; i++) {
            jsonArr.push(value[i].toJson(options));
          }
          break;
      }
      return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : void 0;
    }
    switch (field.kind) {
      case "scalar":
        return writeScalar(field.T, value);
      case "enum":
        return writeEnum(field.T, value, options.enumAsInteger);
      case "message":
        return wrapField(field.T, value).toJson(options);
    }
  }
  function writeEnum(type, value, enumAsInteger) {
    var _a;
    assert(typeof value == "number");
    if (type.typeName == "google.protobuf.NullValue") {
      return null;
    }
    if (enumAsInteger) {
      return value;
    }
    const val = type.findNumber(value);
    return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value;
  }
  function writeScalar(type, value) {
    switch (type) {
      // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
      case ScalarType.INT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
        assert(typeof value == "number");
        return value;
      // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
      // Either numbers or strings are accepted. Exponent notation is also accepted.
      case ScalarType.FLOAT:
      // assertFloat32(value);
      case ScalarType.DOUBLE:
        assert(typeof value == "number");
        if (Number.isNaN(value))
          return "NaN";
        if (value === Number.POSITIVE_INFINITY)
          return "Infinity";
        if (value === Number.NEGATIVE_INFINITY)
          return "-Infinity";
        return value;
      // string:
      case ScalarType.STRING:
        assert(typeof value == "string");
        return value;
      // bool:
      case ScalarType.BOOL:
        assert(typeof value == "boolean");
        return value;
      // JSON value will be a decimal string. Either numbers or strings are accepted.
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
        return value.toString();
      // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
      // Either standard or URL-safe base64 encoding with/without paddings are accepted.
      case ScalarType.BYTES:
        assert(value instanceof Uint8Array);
        return protoBase64.enc(value);
    }
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/binary-format.js
  var unknownFieldsSymbol = /* @__PURE__ */ Symbol("@bufbuild/protobuf/unknown-fields");
  var readDefaults = {
    readUnknownFields: true,
    readerFactory: (bytes) => new BinaryReader(bytes)
  };
  var writeDefaults = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter()
  };
  function makeReadOptions2(options) {
    return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
  }
  function makeWriteOptions2(options) {
    return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
  }
  function makeBinaryFormat() {
    return {
      makeReadOptions: makeReadOptions2,
      makeWriteOptions: makeWriteOptions2,
      listUnknownFields(message) {
        var _a;
        return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
      },
      discardUnknownFields(message) {
        delete message[unknownFieldsSymbol];
      },
      writeUnknownFields(message, writer) {
        const m = message;
        const c = m[unknownFieldsSymbol];
        if (c) {
          for (const f of c) {
            writer.tag(f.no, f.wireType).raw(f.data);
          }
        }
      },
      onUnknownField(message, no, wireType, data) {
        const m = message;
        if (!Array.isArray(m[unknownFieldsSymbol])) {
          m[unknownFieldsSymbol] = [];
        }
        m[unknownFieldsSymbol].push({ no, wireType, data });
      },
      readMessage(message, reader, lengthOrEndTagFieldNo, options, delimitedMessageEncoding) {
        const type = message.getType();
        const end = delimitedMessageEncoding ? reader.len : reader.pos + lengthOrEndTagFieldNo;
        let fieldNo, wireType;
        while (reader.pos < end) {
          [fieldNo, wireType] = reader.tag();
          if (delimitedMessageEncoding === true && wireType == WireType.EndGroup) {
            break;
          }
          const field = type.fields.find(fieldNo);
          if (!field) {
            const data = reader.skip(wireType, fieldNo);
            if (options.readUnknownFields) {
              this.onUnknownField(message, fieldNo, wireType, data);
            }
            continue;
          }
          readField2(message, reader, field, wireType, options);
        }
        if (delimitedMessageEncoding && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        (wireType != WireType.EndGroup || fieldNo !== lengthOrEndTagFieldNo)) {
          throw new Error(`invalid end group tag`);
        }
      },
      readField: readField2,
      writeMessage(message, writer, options) {
        const type = message.getType();
        for (const field of type.fields.byNumber()) {
          if (!isFieldSet(field, message)) {
            if (field.req) {
              throw new Error(`cannot encode field ${type.typeName}.${field.name} to binary: required field not set`);
            }
            continue;
          }
          const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
          writeField2(field, value, writer, options);
        }
        if (options.writeUnknownFields) {
          this.writeUnknownFields(message, writer);
        }
        return writer;
      },
      writeField(field, value, writer, options) {
        if (value === void 0) {
          return void 0;
        }
        writeField2(field, value, writer, options);
      }
    };
  }
  function readField2(target, reader, field, wireType, options) {
    let { repeated, localName } = field;
    if (field.oneof) {
      target = target[field.oneof.localName];
      if (target.case != localName) {
        delete target.value;
      }
      target.case = localName;
      localName = "value";
    }
    switch (field.kind) {
      case "scalar":
      case "enum":
        const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
        let read = readScalar2;
        if (field.kind == "scalar" && field.L > 0) {
          read = readScalarLTString;
        }
        if (repeated) {
          let arr = target[localName];
          const isPacked = wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES;
          if (isPacked) {
            let e = reader.uint32() + reader.pos;
            while (reader.pos < e) {
              arr.push(read(reader, scalarType));
            }
          } else {
            arr.push(read(reader, scalarType));
          }
        } else {
          target[localName] = read(reader, scalarType);
        }
        break;
      case "message":
        const messageType = field.T;
        if (repeated) {
          target[localName].push(readMessageField(reader, new messageType(), options, field));
        } else {
          if (isMessage(target[localName])) {
            readMessageField(reader, target[localName], options, field);
          } else {
            target[localName] = readMessageField(reader, new messageType(), options, field);
            if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
              target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
            }
          }
        }
        break;
      case "map":
        let [mapKey, mapVal] = readMapEntry(field, reader, options);
        target[localName][mapKey] = mapVal;
        break;
    }
  }
  function readMessageField(reader, message, options, field) {
    const format = message.getType().runtime.bin;
    const delimited = field === null || field === void 0 ? void 0 : field.delimited;
    format.readMessage(
      message,
      reader,
      delimited ? field.no : reader.uint32(),
      // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      options,
      delimited
    );
    return message;
  }
  function readMapEntry(field, reader, options) {
    const length = reader.uint32(), end = reader.pos + length;
    let key, val;
    while (reader.pos < end) {
      const [fieldNo] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = readScalar2(reader, field.K);
          break;
        case 2:
          switch (field.V.kind) {
            case "scalar":
              val = readScalar2(reader, field.V.T);
              break;
            case "enum":
              val = reader.int32();
              break;
            case "message":
              val = readMessageField(reader, new field.V.T(), options, void 0);
              break;
          }
          break;
      }
    }
    if (key === void 0) {
      key = scalarZeroValue(field.K, LongType.BIGINT);
    }
    if (typeof key != "string" && typeof key != "number") {
      key = key.toString();
    }
    if (val === void 0) {
      switch (field.V.kind) {
        case "scalar":
          val = scalarZeroValue(field.V.T, LongType.BIGINT);
          break;
        case "enum":
          val = field.V.T.values[0].no;
          break;
        case "message":
          val = new field.V.T();
          break;
      }
    }
    return [key, val];
  }
  function readScalarLTString(reader, type) {
    const v = readScalar2(reader, type);
    return typeof v == "bigint" ? v.toString() : v;
  }
  function readScalar2(reader, type) {
    switch (type) {
      case ScalarType.STRING:
        return reader.string();
      case ScalarType.BOOL:
        return reader.bool();
      case ScalarType.DOUBLE:
        return reader.double();
      case ScalarType.FLOAT:
        return reader.float();
      case ScalarType.INT32:
        return reader.int32();
      case ScalarType.INT64:
        return reader.int64();
      case ScalarType.UINT64:
        return reader.uint64();
      case ScalarType.FIXED64:
        return reader.fixed64();
      case ScalarType.BYTES:
        return reader.bytes();
      case ScalarType.FIXED32:
        return reader.fixed32();
      case ScalarType.SFIXED32:
        return reader.sfixed32();
      case ScalarType.SFIXED64:
        return reader.sfixed64();
      case ScalarType.SINT64:
        return reader.sint64();
      case ScalarType.UINT32:
        return reader.uint32();
      case ScalarType.SINT32:
        return reader.sint32();
    }
  }
  function writeField2(field, value, writer, options) {
    assert(value !== void 0);
    const repeated = field.repeated;
    switch (field.kind) {
      case "scalar":
      case "enum":
        let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
        if (repeated) {
          assert(Array.isArray(value));
          if (field.packed) {
            writePacked(writer, scalarType, field.no, value);
          } else {
            for (const item of value) {
              writeScalar2(writer, scalarType, field.no, item);
            }
          }
        } else {
          writeScalar2(writer, scalarType, field.no, value);
        }
        break;
      case "message":
        if (repeated) {
          assert(Array.isArray(value));
          for (const item of value) {
            writeMessageField(writer, options, field, item);
          }
        } else {
          writeMessageField(writer, options, field, value);
        }
        break;
      case "map":
        assert(typeof value == "object" && value != null);
        for (const [key, val] of Object.entries(value)) {
          writeMapEntry(writer, options, field, key, val);
        }
        break;
    }
  }
  function writeMapEntry(writer, options, field, key, value) {
    writer.tag(field.no, WireType.LengthDelimited);
    writer.fork();
    let keyValue = key;
    switch (field.K) {
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
        keyValue = Number.parseInt(key);
        break;
      case ScalarType.BOOL:
        assert(key == "true" || key == "false");
        keyValue = key == "true";
        break;
    }
    writeScalar2(writer, field.K, 1, keyValue);
    switch (field.V.kind) {
      case "scalar":
        writeScalar2(writer, field.V.T, 2, value);
        break;
      case "enum":
        writeScalar2(writer, ScalarType.INT32, 2, value);
        break;
      case "message":
        assert(value !== void 0);
        writer.tag(2, WireType.LengthDelimited).bytes(value.toBinary(options));
        break;
    }
    writer.join();
  }
  function writeMessageField(writer, options, field, value) {
    const message = wrapField(field.T, value);
    if (field.delimited)
      writer.tag(field.no, WireType.StartGroup).raw(message.toBinary(options)).tag(field.no, WireType.EndGroup);
    else
      writer.tag(field.no, WireType.LengthDelimited).bytes(message.toBinary(options));
  }
  function writeScalar2(writer, type, fieldNo, value) {
    assert(value !== void 0);
    let [wireType, method] = scalarTypeInfo(type);
    writer.tag(fieldNo, wireType)[method](value);
  }
  function writePacked(writer, type, fieldNo, value) {
    if (!value.length) {
      return;
    }
    writer.tag(fieldNo, WireType.LengthDelimited).fork();
    let [, method] = scalarTypeInfo(type);
    for (let i = 0; i < value.length; i++) {
      writer[method](value[i]);
    }
    writer.join();
  }
  function scalarTypeInfo(type) {
    let wireType = WireType.Varint;
    switch (type) {
      case ScalarType.BYTES:
      case ScalarType.STRING:
        wireType = WireType.LengthDelimited;
        break;
      case ScalarType.DOUBLE:
      case ScalarType.FIXED64:
      case ScalarType.SFIXED64:
        wireType = WireType.Bit64;
        break;
      case ScalarType.FIXED32:
      case ScalarType.SFIXED32:
      case ScalarType.FLOAT:
        wireType = WireType.Bit32;
        break;
    }
    const method = ScalarType[type].toLowerCase();
    return [wireType, method];
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
  function makeUtilCommon() {
    return {
      setEnumType,
      initPartial(source, target) {
        if (source === void 0) {
          return;
        }
        const type = target.getType();
        for (const member of type.fields.byMember()) {
          const localName = member.localName, t = target, s = source;
          if (s[localName] == null) {
            continue;
          }
          switch (member.kind) {
            case "oneof":
              const sk = s[localName].case;
              if (sk === void 0) {
                continue;
              }
              const sourceField = member.findField(sk);
              let val = s[localName].value;
              if (sourceField && sourceField.kind == "message" && !isMessage(val, sourceField.T)) {
                val = new sourceField.T(val);
              } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
                val = toU8Arr(val);
              }
              t[localName] = { case: sk, value: val };
              break;
            case "scalar":
            case "enum":
              let copy = s[localName];
              if (member.T === ScalarType.BYTES) {
                copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
              }
              t[localName] = copy;
              break;
            case "map":
              switch (member.V.kind) {
                case "scalar":
                case "enum":
                  if (member.V.T === ScalarType.BYTES) {
                    for (const [k, v] of Object.entries(s[localName])) {
                      t[localName][k] = toU8Arr(v);
                    }
                  } else {
                    Object.assign(t[localName], s[localName]);
                  }
                  break;
                case "message":
                  const messageType = member.V.T;
                  for (const k of Object.keys(s[localName])) {
                    let val2 = s[localName][k];
                    if (!messageType.fieldWrapper) {
                      val2 = new messageType(val2);
                    }
                    t[localName][k] = val2;
                  }
                  break;
              }
              break;
            case "message":
              const mt = member.T;
              if (member.repeated) {
                t[localName] = s[localName].map((val2) => isMessage(val2, mt) ? val2 : new mt(val2));
              } else {
                const val2 = s[localName];
                if (mt.fieldWrapper) {
                  if (
                    // We can't use BytesValue.typeName as that will create a circular import
                    mt.typeName === "google.protobuf.BytesValue"
                  ) {
                    t[localName] = toU8Arr(val2);
                  } else {
                    t[localName] = val2;
                  }
                } else {
                  t[localName] = isMessage(val2, mt) ? val2 : new mt(val2);
                }
              }
              break;
          }
        }
      },
      // TODO use isFieldSet() here to support future field presence
      equals(type, a, b) {
        if (a === b) {
          return true;
        }
        if (!a || !b) {
          return false;
        }
        return type.fields.byMember().every((m) => {
          const va = a[m.localName];
          const vb = b[m.localName];
          if (m.repeated) {
            if (va.length !== vb.length) {
              return false;
            }
            switch (m.kind) {
              case "message":
                return va.every((a2, i) => m.T.equals(a2, vb[i]));
              case "scalar":
                return va.every((a2, i) => scalarEquals(m.T, a2, vb[i]));
              case "enum":
                return va.every((a2, i) => scalarEquals(ScalarType.INT32, a2, vb[i]));
            }
            throw new Error(`repeated cannot contain ${m.kind}`);
          }
          switch (m.kind) {
            case "message":
              let a2 = va;
              let b2 = vb;
              if (m.T.fieldWrapper) {
                if (a2 !== void 0 && !isMessage(a2)) {
                  a2 = m.T.fieldWrapper.wrapField(a2);
                }
                if (b2 !== void 0 && !isMessage(b2)) {
                  b2 = m.T.fieldWrapper.wrapField(b2);
                }
              }
              return m.T.equals(a2, b2);
            case "enum":
              return scalarEquals(ScalarType.INT32, va, vb);
            case "scalar":
              return scalarEquals(m.T, va, vb);
            case "oneof":
              if (va.case !== vb.case) {
                return false;
              }
              const s = m.findField(va.case);
              if (s === void 0) {
                return true;
              }
              switch (s.kind) {
                case "message":
                  return s.T.equals(va.value, vb.value);
                case "enum":
                  return scalarEquals(ScalarType.INT32, va.value, vb.value);
                case "scalar":
                  return scalarEquals(s.T, va.value, vb.value);
              }
              throw new Error(`oneof cannot contain ${s.kind}`);
            case "map":
              const keys = Object.keys(va).concat(Object.keys(vb));
              switch (m.V.kind) {
                case "message":
                  const messageType = m.V.T;
                  return keys.every((k) => messageType.equals(va[k], vb[k]));
                case "enum":
                  return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
                case "scalar":
                  const scalarType = m.V.T;
                  return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
              }
              break;
          }
        });
      },
      // TODO use isFieldSet() here to support future field presence
      clone(message) {
        const type = message.getType(), target = new type(), any = target;
        for (const member of type.fields.byMember()) {
          const source = message[member.localName];
          let copy;
          if (member.repeated) {
            copy = source.map(cloneSingularField);
          } else if (member.kind == "map") {
            copy = any[member.localName];
            for (const [key, v] of Object.entries(source)) {
              copy[key] = cloneSingularField(v);
            }
          } else if (member.kind == "oneof") {
            const f = member.findField(source.case);
            copy = f ? { case: source.case, value: cloneSingularField(source.value) } : { case: void 0 };
          } else {
            copy = cloneSingularField(source);
          }
          any[member.localName] = copy;
        }
        for (const uf of type.runtime.bin.listUnknownFields(message)) {
          type.runtime.bin.onUnknownField(any, uf.no, uf.wireType, uf.data);
        }
        return target;
      }
    };
  }
  function cloneSingularField(value) {
    if (value === void 0) {
      return value;
    }
    if (isMessage(value)) {
      return value.clone();
    }
    if (value instanceof Uint8Array) {
      const c = new Uint8Array(value.byteLength);
      c.set(value);
      return c;
    }
    return value;
  }
  function toU8Arr(input) {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
  function makeProtoRuntime(syntax, newFieldList, initFields) {
    return {
      syntax,
      json: makeJsonFormat(),
      bin: makeBinaryFormat(),
      util: Object.assign(Object.assign({}, makeUtilCommon()), {
        newFieldList,
        initFields
      }),
      makeMessageType(typeName, fields, opt) {
        return makeMessageType(this, typeName, fields, opt);
      },
      makeEnum,
      makeEnumType,
      getEnumType,
      makeExtension(typeName, extendee, field) {
        return makeExtension(this, typeName, extendee, field);
      }
    };
  }

  // node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
  var InternalFieldList = class {
    constructor(fields, normalizer) {
      this._fields = fields;
      this._normalizer = normalizer;
    }
    findJsonName(jsonName) {
      if (!this.jsonNames) {
        const t = {};
        for (const f of this.list()) {
          t[f.jsonName] = t[f.name] = f;
        }
        this.jsonNames = t;
      }
      return this.jsonNames[jsonName];
    }
    find(fieldNo) {
      if (!this.numbers) {
        const t = {};
        for (const f of this.list()) {
          t[f.no] = f;
        }
        this.numbers = t;
      }
      return this.numbers[fieldNo];
    }
    list() {
      if (!this.all) {
        this.all = this._normalizer(this._fields);
      }
      return this.all;
    }
    byNumber() {
      if (!this.numbersAsc) {
        this.numbersAsc = this.list().concat().sort((a, b) => a.no - b.no);
      }
      return this.numbersAsc;
    }
    byMember() {
      if (!this.members) {
        this.members = [];
        const a = this.members;
        let o;
        for (const f of this.list()) {
          if (f.oneof) {
            if (f.oneof !== o) {
              o = f.oneof;
              a.push(o);
            }
          } else {
            a.push(f);
          }
        }
      }
      return this.members;
    }
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/names.js
  function localFieldName(protoName, inOneof) {
    const name = protoCamelCase(protoName);
    if (inOneof) {
      return name;
    }
    return safeObjectProperty(safeMessageProperty(name));
  }
  function localOneofName(protoName) {
    return localFieldName(protoName, false);
  }
  var fieldJsonName = protoCamelCase;
  function protoCamelCase(snakeCase) {
    let capNext = false;
    const b = [];
    for (let i = 0; i < snakeCase.length; i++) {
      let c = snakeCase.charAt(i);
      switch (c) {
        case "_":
          capNext = true;
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          b.push(c);
          capNext = false;
          break;
        default:
          if (capNext) {
            capNext = false;
            c = c.toUpperCase();
          }
          b.push(c);
          break;
      }
    }
    return b.join("");
  }
  var reservedObjectProperties = /* @__PURE__ */ new Set([
    // names reserved by JavaScript
    "constructor",
    "toString",
    "toJSON",
    "valueOf"
  ]);
  var reservedMessageProperties = /* @__PURE__ */ new Set([
    // names reserved by the runtime
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    // names reserved by the runtime for the future
    "toObject"
  ]);
  var fallback = (name) => `${name}$`;
  var safeMessageProperty = (name) => {
    if (reservedMessageProperties.has(name)) {
      return fallback(name);
    }
    return name;
  };
  var safeObjectProperty = (name) => {
    if (reservedObjectProperties.has(name)) {
      return fallback(name);
    }
    return name;
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/field.js
  var InternalOneofInfo = class {
    constructor(name) {
      this.kind = "oneof";
      this.repeated = false;
      this.packed = false;
      this.opt = false;
      this.req = false;
      this.default = void 0;
      this.fields = [];
      this.name = name;
      this.localName = localOneofName(name);
    }
    addField(field) {
      assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
      this.fields.push(field);
    }
    findField(localName) {
      if (!this._lookup) {
        this._lookup = /* @__PURE__ */ Object.create(null);
        for (let i = 0; i < this.fields.length; i++) {
          this._lookup[this.fields[i].localName] = this.fields[i];
        }
      }
      return this._lookup[localName];
    }
  };

  // node_modules/@bufbuild/protobuf/dist/esm/private/field-normalize.js
  function normalizeFieldInfos(fieldInfos, packedByDefault) {
    var _a, _b, _c, _d, _e, _f;
    const r = [];
    let o;
    for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos) {
      const f = field;
      f.localName = localFieldName(field.name, field.oneof !== void 0);
      f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
      f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
      if (field.kind == "scalar") {
        f.L = (_c = field.L) !== null && _c !== void 0 ? _c : LongType.BIGINT;
      }
      f.delimited = (_d = field.delimited) !== null && _d !== void 0 ? _d : false;
      f.req = (_e = field.req) !== null && _e !== void 0 ? _e : false;
      f.opt = (_f = field.opt) !== null && _f !== void 0 ? _f : false;
      if (field.packed === void 0) {
        if (packedByDefault) {
          f.packed = field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
        } else {
          f.packed = false;
        }
      }
      if (field.oneof !== void 0) {
        const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
        if (!o || o.name != ooname) {
          o = new InternalOneofInfo(ooname);
        }
        f.oneof = o;
        o.addField(f);
      }
      r.push(f);
    }
    return r;
  }

  // node_modules/@bufbuild/protobuf/dist/esm/proto3.js
  var proto3 = makeProtoRuntime(
    "proto3",
    (fields) => {
      return new InternalFieldList(fields, (source) => normalizeFieldInfos(source, true));
    },
    // TODO merge with proto2 and initExtensionField, also see initPartial, equals, clone
    (target) => {
      for (const member of target.getType().fields.byMember()) {
        if (member.opt) {
          continue;
        }
        const name = member.localName, t = target;
        if (member.repeated) {
          t[name] = [];
          continue;
        }
        switch (member.kind) {
          case "oneof":
            t[name] = { case: void 0 };
            break;
          case "enum":
            t[name] = 0;
            break;
          case "map":
            t[name] = {};
            break;
          case "scalar":
            t[name] = scalarZeroValue(member.T, member.L);
            break;
          case "message":
            break;
        }
      }
    }
  );

  // node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/timestamp_pb.js
  var Timestamp = class _Timestamp extends Message {
    constructor(data) {
      super();
      this.seconds = protoInt64.zero;
      this.nanos = 0;
      proto3.util.initPartial(data, this);
    }
    fromJson(json, options) {
      if (typeof json !== "string") {
        throw new Error(`cannot decode google.protobuf.Timestamp from JSON: ${proto3.json.debug(json)}`);
      }
      const matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
      if (!matches) {
        throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
      }
      const ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
      if (Number.isNaN(ms)) {
        throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
      }
      if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
        throw new Error(`cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
      }
      this.seconds = protoInt64.parse(ms / 1e3);
      this.nanos = 0;
      if (matches[7]) {
        this.nanos = parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1e9;
      }
      return this;
    }
    toJson(options) {
      const ms = Number(this.seconds) * 1e3;
      if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
        throw new Error(`cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
      }
      if (this.nanos < 0) {
        throw new Error(`cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative`);
      }
      let z = "Z";
      if (this.nanos > 0) {
        const nanosStr = (this.nanos + 1e9).toString().substring(1);
        if (nanosStr.substring(3) === "000000") {
          z = "." + nanosStr.substring(0, 3) + "Z";
        } else if (nanosStr.substring(6) === "000") {
          z = "." + nanosStr.substring(0, 6) + "Z";
        } else {
          z = "." + nanosStr + "Z";
        }
      }
      return new Date(ms).toISOString().replace(".000Z", z);
    }
    toDate() {
      return new Date(Number(this.seconds) * 1e3 + Math.ceil(this.nanos / 1e6));
    }
    static now() {
      return _Timestamp.fromDate(/* @__PURE__ */ new Date());
    }
    static fromDate(date) {
      const ms = date.getTime();
      return new _Timestamp({
        seconds: protoInt64.parse(Math.floor(ms / 1e3)),
        nanos: ms % 1e3 * 1e6
      });
    }
    static fromBinary(bytes, options) {
      return new _Timestamp().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Timestamp().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Timestamp().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Timestamp, a, b);
    }
  };
  Timestamp.runtime = proto3;
  Timestamp.typeName = "google.protobuf.Timestamp";
  Timestamp.fields = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: "seconds",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "nanos",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    }
  ]);

  // node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/duration_pb.js
  var Duration = class _Duration extends Message {
    constructor(data) {
      super();
      this.seconds = protoInt64.zero;
      this.nanos = 0;
      proto3.util.initPartial(data, this);
    }
    fromJson(json, options) {
      if (typeof json !== "string") {
        throw new Error(`cannot decode google.protobuf.Duration from JSON: ${proto3.json.debug(json)}`);
      }
      const match = json.match(/^(-?[0-9]+)(?:\.([0-9]+))?s/);
      if (match === null) {
        throw new Error(`cannot decode google.protobuf.Duration from JSON: ${proto3.json.debug(json)}`);
      }
      const longSeconds = Number(match[1]);
      if (longSeconds > 315576e6 || longSeconds < -315576e6) {
        throw new Error(`cannot decode google.protobuf.Duration from JSON: ${proto3.json.debug(json)}`);
      }
      this.seconds = protoInt64.parse(longSeconds);
      if (typeof match[2] == "string") {
        const nanosStr = match[2] + "0".repeat(9 - match[2].length);
        this.nanos = parseInt(nanosStr);
        if (longSeconds < 0 || Object.is(longSeconds, -0)) {
          this.nanos = -this.nanos;
        }
      }
      return this;
    }
    toJson(options) {
      if (Number(this.seconds) > 315576e6 || Number(this.seconds) < -315576e6) {
        throw new Error(`cannot encode google.protobuf.Duration to JSON: value out of range`);
      }
      let text = this.seconds.toString();
      if (this.nanos !== 0) {
        let nanosStr = Math.abs(this.nanos).toString();
        nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;
        if (nanosStr.substring(3) === "000000") {
          nanosStr = nanosStr.substring(0, 3);
        } else if (nanosStr.substring(6) === "000") {
          nanosStr = nanosStr.substring(0, 6);
        }
        text += "." + nanosStr;
        if (this.nanos < 0 && Number(this.seconds) == 0) {
          text = "-" + text;
        }
      }
      return text + "s";
    }
    static fromBinary(bytes, options) {
      return new _Duration().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Duration().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Duration().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Duration, a, b);
    }
  };
  Duration.runtime = proto3;
  Duration.typeName = "google.protobuf.Duration";
  Duration.fields = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: "seconds",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "nanos",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    }
  ]);

  // node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/any_pb.js
  var Any = class _Any extends Message {
    constructor(data) {
      super();
      this.typeUrl = "";
      this.value = new Uint8Array(0);
      proto3.util.initPartial(data, this);
    }
    toJson(options) {
      var _a;
      if (this.typeUrl === "") {
        return {};
      }
      const typeName = this.typeUrlToName(this.typeUrl);
      const messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
      if (!messageType) {
        throw new Error(`cannot encode message google.protobuf.Any to JSON: "${this.typeUrl}" is not in the type registry`);
      }
      const message = messageType.fromBinary(this.value);
      let json = message.toJson(options);
      if (typeName.startsWith("google.protobuf.") || (json === null || Array.isArray(json) || typeof json !== "object")) {
        json = { value: json };
      }
      json["@type"] = this.typeUrl;
      return json;
    }
    fromJson(json, options) {
      var _a;
      if (json === null || Array.isArray(json) || typeof json != "object") {
        throw new Error(`cannot decode message google.protobuf.Any from JSON: expected object but got ${json === null ? "null" : Array.isArray(json) ? "array" : typeof json}`);
      }
      if (Object.keys(json).length == 0) {
        return this;
      }
      const typeUrl = json["@type"];
      if (typeof typeUrl != "string" || typeUrl == "") {
        throw new Error(`cannot decode message google.protobuf.Any from JSON: "@type" is empty`);
      }
      const typeName = this.typeUrlToName(typeUrl), messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
      if (!messageType) {
        throw new Error(`cannot decode message google.protobuf.Any from JSON: ${typeUrl} is not in the type registry`);
      }
      let message;
      if (typeName.startsWith("google.protobuf.") && Object.prototype.hasOwnProperty.call(json, "value")) {
        message = messageType.fromJson(json["value"], options);
      } else {
        const copy = Object.assign({}, json);
        delete copy["@type"];
        message = messageType.fromJson(copy, options);
      }
      this.packFrom(message);
      return this;
    }
    packFrom(message) {
      this.value = message.toBinary();
      this.typeUrl = this.typeNameToUrl(message.getType().typeName);
    }
    unpackTo(target) {
      if (!this.is(target.getType())) {
        return false;
      }
      target.fromBinary(this.value);
      return true;
    }
    unpack(registry) {
      if (this.typeUrl === "") {
        return void 0;
      }
      const messageType = registry.findMessage(this.typeUrlToName(this.typeUrl));
      if (!messageType) {
        return void 0;
      }
      return messageType.fromBinary(this.value);
    }
    is(type) {
      if (this.typeUrl === "") {
        return false;
      }
      const name = this.typeUrlToName(this.typeUrl);
      let typeName = "";
      if (typeof type === "string") {
        typeName = type;
      } else {
        typeName = type.typeName;
      }
      return name === typeName;
    }
    typeNameToUrl(name) {
      return `type.googleapis.com/${name}`;
    }
    typeUrlToName(url) {
      if (!url.length) {
        throw new Error(`invalid type url: ${url}`);
      }
      const slash = url.lastIndexOf("/");
      const name = slash >= 0 ? url.substring(slash + 1) : url;
      if (!name.length) {
        throw new Error(`invalid type url: ${url}`);
      }
      return name;
    }
    static pack(message) {
      const any = new _Any();
      any.packFrom(message);
      return any;
    }
    static fromBinary(bytes, options) {
      return new _Any().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Any().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Any().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Any, a, b);
    }
  };
  Any.runtime = proto3;
  Any.typeName = "google.protobuf.Any";
  Any.fields = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: "type_url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "value",
      kind: "scalar",
      T: 12
      /* ScalarType.BYTES */
    }
  ]);

  // node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js
  var NullValue;
  (function(NullValue2) {
    NullValue2[NullValue2["NULL_VALUE"] = 0] = "NULL_VALUE";
  })(NullValue || (NullValue = {}));
  proto3.util.setEnumType(NullValue, "google.protobuf.NullValue", [
    { no: 0, name: "NULL_VALUE" }
  ]);
  var Struct = class _Struct extends Message {
    constructor(data) {
      super();
      this.fields = {};
      proto3.util.initPartial(data, this);
    }
    toJson(options) {
      const json = {};
      for (const [k, v] of Object.entries(this.fields)) {
        json[k] = v.toJson(options);
      }
      return json;
    }
    fromJson(json, options) {
      if (typeof json != "object" || json == null || Array.isArray(json)) {
        throw new Error("cannot decode google.protobuf.Struct from JSON " + proto3.json.debug(json));
      }
      for (const [k, v] of Object.entries(json)) {
        this.fields[k] = Value.fromJson(v);
      }
      return this;
    }
    static fromBinary(bytes, options) {
      return new _Struct().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Struct().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Struct().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Struct, a, b);
    }
  };
  Struct.runtime = proto3;
  Struct.typeName = "google.protobuf.Struct";
  Struct.fields = proto3.util.newFieldList(() => [
    { no: 1, name: "fields", kind: "map", K: 9, V: { kind: "message", T: Value } }
  ]);
  var Value = class _Value extends Message {
    constructor(data) {
      super();
      this.kind = { case: void 0 };
      proto3.util.initPartial(data, this);
    }
    toJson(options) {
      switch (this.kind.case) {
        case "nullValue":
          return null;
        case "numberValue":
          if (!Number.isFinite(this.kind.value)) {
            throw new Error("google.protobuf.Value cannot be NaN or Infinity");
          }
          return this.kind.value;
        case "boolValue":
          return this.kind.value;
        case "stringValue":
          return this.kind.value;
        case "structValue":
        case "listValue":
          return this.kind.value.toJson(Object.assign(Object.assign({}, options), { emitDefaultValues: true }));
      }
      throw new Error("google.protobuf.Value must have a value");
    }
    fromJson(json, options) {
      switch (typeof json) {
        case "number":
          this.kind = { case: "numberValue", value: json };
          break;
        case "string":
          this.kind = { case: "stringValue", value: json };
          break;
        case "boolean":
          this.kind = { case: "boolValue", value: json };
          break;
        case "object":
          if (json === null) {
            this.kind = { case: "nullValue", value: NullValue.NULL_VALUE };
          } else if (Array.isArray(json)) {
            this.kind = { case: "listValue", value: ListValue.fromJson(json) };
          } else {
            this.kind = { case: "structValue", value: Struct.fromJson(json) };
          }
          break;
        default:
          throw new Error("cannot decode google.protobuf.Value from JSON " + proto3.json.debug(json));
      }
      return this;
    }
    static fromBinary(bytes, options) {
      return new _Value().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Value().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Value().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Value, a, b);
    }
  };
  Value.runtime = proto3;
  Value.typeName = "google.protobuf.Value";
  Value.fields = proto3.util.newFieldList(() => [
    { no: 1, name: "null_value", kind: "enum", T: proto3.getEnumType(NullValue), oneof: "kind" },
    { no: 2, name: "number_value", kind: "scalar", T: 1, oneof: "kind" },
    { no: 3, name: "string_value", kind: "scalar", T: 9, oneof: "kind" },
    { no: 4, name: "bool_value", kind: "scalar", T: 8, oneof: "kind" },
    { no: 5, name: "struct_value", kind: "message", T: Struct, oneof: "kind" },
    { no: 6, name: "list_value", kind: "message", T: ListValue, oneof: "kind" }
  ]);
  var ListValue = class _ListValue extends Message {
    constructor(data) {
      super();
      this.values = [];
      proto3.util.initPartial(data, this);
    }
    toJson(options) {
      return this.values.map((v) => v.toJson());
    }
    fromJson(json, options) {
      if (!Array.isArray(json)) {
        throw new Error("cannot decode google.protobuf.ListValue from JSON " + proto3.json.debug(json));
      }
      for (let e of json) {
        this.values.push(Value.fromJson(e));
      }
      return this;
    }
    static fromBinary(bytes, options) {
      return new _ListValue().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ListValue().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ListValue().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ListValue, a, b);
    }
  };
  ListValue.runtime = proto3;
  ListValue.typeName = "google.protobuf.ListValue";
  ListValue.fields = proto3.util.newFieldList(() => [
    { no: 1, name: "values", kind: "message", T: Value, repeated: true }
  ]);

  // node_modules/@livekit/protocol/dist/index.mjs
  var ChatRole = /* @__PURE__ */ proto3.makeEnum(
    "livekit.agent.ChatRole",
    [
      { no: 0, name: "DEVELOPER" },
      { no: 1, name: "SYSTEM" },
      { no: 2, name: "USER" },
      { no: 3, name: "ASSISTANT" }
    ]
  );
  var AgentState = /* @__PURE__ */ proto3.makeEnum(
    "livekit.agent.AgentState",
    [
      { no: 0, name: "AS_INITIALIZING" },
      { no: 1, name: "AS_IDLE" },
      { no: 2, name: "AS_LISTENING" },
      { no: 3, name: "AS_THINKING" },
      { no: 4, name: "AS_SPEAKING" }
    ]
  );
  var UserState = /* @__PURE__ */ proto3.makeEnum(
    "livekit.agent.UserState",
    [
      { no: 0, name: "US_SPEAKING" },
      { no: 1, name: "US_LISTENING" },
      { no: 2, name: "US_AWAY" }
    ]
  );
  var MetricsReport = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.MetricsReport",
    () => [
      { no: 1, name: "started_speaking_at", kind: "message", T: Timestamp },
      { no: 2, name: "stopped_speaking_at", kind: "message", T: Timestamp },
      { no: 3, name: "transcription_delay", kind: "scalar", T: 1, opt: true },
      { no: 4, name: "end_of_turn_delay", kind: "scalar", T: 1, opt: true },
      { no: 5, name: "on_user_turn_completed_delay", kind: "scalar", T: 1, opt: true },
      { no: 6, name: "llm_node_ttft", kind: "scalar", T: 1, opt: true },
      { no: 7, name: "tts_node_ttfb", kind: "scalar", T: 1, opt: true },
      { no: 8, name: "e2e_latency", kind: "scalar", T: 1, opt: true }
    ]
  );
  var ChatMessage$1 = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.ChatMessage",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "role", kind: "enum", T: proto3.getEnumType(ChatRole) },
      { no: 3, name: "content", kind: "message", T: ChatMessage_ChatContent, repeated: true },
      {
        no: 4,
        name: "interrupted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 5, name: "transcript_confidence", kind: "scalar", T: 1, opt: true },
      { no: 6, name: "extra", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 7, name: "metrics", kind: "message", T: MetricsReport },
      { no: 8, name: "created_at", kind: "message", T: Timestamp }
    ]
  );
  var ChatMessage_ChatContent = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.ChatMessage.ChatContent",
    () => [
      { no: 1, name: "text", kind: "scalar", T: 9, oneof: "payload" }
    ],
    { localName: "ChatMessage_ChatContent" }
  );
  var FunctionCall = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.FunctionCall",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "arguments",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "created_at", kind: "message", T: Timestamp }
    ]
  );
  var FunctionCallOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.FunctionCallOutput",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "output",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "is_error",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 6, name: "created_at", kind: "message", T: Timestamp }
    ]
  );
  var AgentHandoff = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentHandoff",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "old_agent_id", kind: "scalar", T: 9, opt: true },
      {
        no: 3,
        name: "new_agent_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "created_at", kind: "message", T: Timestamp }
    ]
  );
  var AgentConfigUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentConfigUpdate",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "instructions", kind: "scalar", T: 9, opt: true },
      { no: 3, name: "tools_added", kind: "scalar", T: 9, repeated: true },
      { no: 4, name: "tools_removed", kind: "scalar", T: 9, repeated: true },
      { no: 5, name: "created_at", kind: "message", T: Timestamp }
    ]
  );
  var ChatContext = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.ChatContext",
    () => [
      { no: 1, name: "items", kind: "message", T: ChatContext_ChatItem, repeated: true }
    ]
  );
  var ChatContext_ChatItem = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.ChatContext.ChatItem",
    () => [
      { no: 1, name: "message", kind: "message", T: ChatMessage$1, oneof: "item" },
      { no: 2, name: "function_call", kind: "message", T: FunctionCall, oneof: "item" },
      { no: 3, name: "function_call_output", kind: "message", T: FunctionCallOutput, oneof: "item" },
      { no: 4, name: "agent_handoff", kind: "message", T: AgentHandoff, oneof: "item" },
      { no: 5, name: "agent_config_update", kind: "message", T: AgentConfigUpdate, oneof: "item" }
    ],
    { localName: "ChatContext_ChatItem" }
  );
  var LLMModelUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.LLMModelUsage",
    () => [
      {
        no: 1,
        name: "provider",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "input_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "input_cached_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 5,
        name: "input_audio_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 6,
        name: "input_cached_audio_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 7,
        name: "input_text_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 8,
        name: "input_cached_text_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 9,
        name: "input_image_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 10,
        name: "input_cached_image_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 11,
        name: "output_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 12,
        name: "output_audio_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 13,
        name: "output_text_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 14,
        name: "session_duration",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var TTSModelUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.TTSModelUsage",
    () => [
      {
        no: 1,
        name: "provider",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "input_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "output_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 5,
        name: "characters_count",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 6,
        name: "audio_duration",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var STTModelUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.STTModelUsage",
    () => [
      {
        no: 1,
        name: "provider",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "input_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "output_tokens",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 5,
        name: "audio_duration",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var InterruptionModelUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.InterruptionModelUsage",
    () => [
      {
        no: 1,
        name: "provider",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "total_requests",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var ModelUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.ModelUsage",
    () => [
      { no: 1, name: "llm", kind: "message", T: LLMModelUsage, oneof: "usage" },
      { no: 2, name: "tts", kind: "message", T: TTSModelUsage, oneof: "usage" },
      { no: 3, name: "stt", kind: "message", T: STTModelUsage, oneof: "usage" },
      { no: 4, name: "interruption", kind: "message", T: InterruptionModelUsage, oneof: "usage" }
    ]
  );
  var AgentSessionUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionUsage",
    () => [
      { no: 1, name: "model_usage", kind: "message", T: ModelUsage, repeated: true }
    ]
  );
  var AgentSessionEvent = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent",
    () => [
      { no: 1, name: "created_at", kind: "message", T: Timestamp },
      { no: 10, name: "agent_state_changed", kind: "message", T: AgentSessionEvent_AgentStateChanged, oneof: "event" },
      { no: 11, name: "user_state_changed", kind: "message", T: AgentSessionEvent_UserStateChanged, oneof: "event" },
      { no: 12, name: "conversation_item_added", kind: "message", T: AgentSessionEvent_ConversationItemAdded, oneof: "event" },
      { no: 13, name: "user_input_transcribed", kind: "message", T: AgentSessionEvent_UserInputTranscribed, oneof: "event" },
      { no: 14, name: "function_tools_executed", kind: "message", T: AgentSessionEvent_FunctionToolsExecuted, oneof: "event" },
      { no: 15, name: "error", kind: "message", T: AgentSessionEvent_Error, oneof: "event" },
      { no: 16, name: "overlapping_speech", kind: "message", T: AgentSessionEvent_OverlappingSpeech, oneof: "event" },
      { no: 17, name: "session_usage_updated", kind: "message", T: AgentSessionEvent_SessionUsageUpdated, oneof: "event" }
    ]
  );
  var AgentSessionEvent_AgentStateChanged = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.AgentStateChanged",
    () => [
      { no: 1, name: "old_state", kind: "enum", T: proto3.getEnumType(AgentState) },
      { no: 2, name: "new_state", kind: "enum", T: proto3.getEnumType(AgentState) }
    ],
    { localName: "AgentSessionEvent_AgentStateChanged" }
  );
  var AgentSessionEvent_UserStateChanged = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.UserStateChanged",
    () => [
      { no: 1, name: "old_state", kind: "enum", T: proto3.getEnumType(UserState) },
      { no: 2, name: "new_state", kind: "enum", T: proto3.getEnumType(UserState) }
    ],
    { localName: "AgentSessionEvent_UserStateChanged" }
  );
  var AgentSessionEvent_ConversationItemAdded = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.ConversationItemAdded",
    () => [
      { no: 1, name: "item", kind: "message", T: ChatContext_ChatItem }
    ],
    { localName: "AgentSessionEvent_ConversationItemAdded" }
  );
  var AgentSessionEvent_UserInputTranscribed = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.UserInputTranscribed",
    () => [
      {
        no: 1,
        name: "transcript",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "is_final",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "language", kind: "scalar", T: 9, opt: true }
    ],
    { localName: "AgentSessionEvent_UserInputTranscribed" }
  );
  var AgentSessionEvent_FunctionToolsExecuted = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.FunctionToolsExecuted",
    () => [
      { no: 1, name: "function_calls", kind: "message", T: FunctionCall, repeated: true },
      { no: 2, name: "function_call_outputs", kind: "message", T: FunctionCallOutput, repeated: true }
    ],
    { localName: "AgentSessionEvent_FunctionToolsExecuted" }
  );
  var AgentSessionEvent_Error = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.Error",
    () => [
      {
        no: 1,
        name: "message",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ],
    { localName: "AgentSessionEvent_Error" }
  );
  var AgentSessionEvent_OverlappingSpeech = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.OverlappingSpeech",
    () => [
      {
        no: 1,
        name: "is_interruption",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 2, name: "overlap_started_at", kind: "message", T: Timestamp, opt: true },
      {
        no: 3,
        name: "detection_delay",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      { no: 4, name: "detected_at", kind: "message", T: Timestamp }
    ],
    { localName: "AgentSessionEvent_OverlappingSpeech" }
  );
  var AgentSessionEvent_SessionUsageUpdated = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionEvent.SessionUsageUpdated",
    () => [
      { no: 1, name: "usage", kind: "message", T: AgentSessionUsage }
    ],
    { localName: "AgentSessionEvent_SessionUsageUpdated" }
  );
  var SessionRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest",
    () => [
      {
        no: 1,
        name: "request_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "ping", kind: "message", T: SessionRequest_Ping, oneof: "request" },
      { no: 4, name: "get_chat_history", kind: "message", T: SessionRequest_GetChatHistory, oneof: "request" },
      { no: 5, name: "run_input", kind: "message", T: SessionRequest_RunInput, oneof: "request" },
      { no: 6, name: "get_agent_info", kind: "message", T: SessionRequest_GetAgentInfo, oneof: "request" },
      { no: 7, name: "get_session_state", kind: "message", T: SessionRequest_GetSessionState, oneof: "request" },
      { no: 8, name: "get_rtc_stats", kind: "message", T: SessionRequest_GetRTCStats, oneof: "request" },
      { no: 9, name: "get_session_usage", kind: "message", T: SessionRequest_GetSessionUsage, oneof: "request" }
    ]
  );
  var SessionRequest_Ping = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.Ping",
    [],
    { localName: "SessionRequest_Ping" }
  );
  var SessionRequest_GetChatHistory = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.GetChatHistory",
    [],
    { localName: "SessionRequest_GetChatHistory" }
  );
  var SessionRequest_RunInput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.RunInput",
    () => [
      {
        no: 1,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ],
    { localName: "SessionRequest_RunInput" }
  );
  var SessionRequest_GetAgentInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.GetAgentInfo",
    [],
    { localName: "SessionRequest_GetAgentInfo" }
  );
  var SessionRequest_GetSessionState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.GetSessionState",
    [],
    { localName: "SessionRequest_GetSessionState" }
  );
  var SessionRequest_GetRTCStats = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.GetRTCStats",
    [],
    { localName: "SessionRequest_GetRTCStats" }
  );
  var SessionRequest_GetSessionUsage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionRequest.GetSessionUsage",
    [],
    { localName: "SessionRequest_GetSessionUsage" }
  );
  var SessionResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse",
    () => [
      {
        no: 1,
        name: "request_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "error", kind: "scalar", T: 9, opt: true },
      { no: 3, name: "pong", kind: "message", T: SessionResponse_Pong, oneof: "response" },
      { no: 5, name: "get_chat_history", kind: "message", T: SessionResponse_GetChatHistoryResponse, oneof: "response" },
      { no: 6, name: "run_input", kind: "message", T: SessionResponse_RunInputResponse, oneof: "response" },
      { no: 7, name: "get_agent_info", kind: "message", T: SessionResponse_GetAgentInfoResponse, oneof: "response" },
      { no: 8, name: "get_session_state", kind: "message", T: SessionResponse_GetSessionStateResponse, oneof: "response" },
      { no: 9, name: "get_rtc_stats", kind: "message", T: SessionResponse_GetRTCStatsResponse, oneof: "response" },
      { no: 10, name: "get_session_usage", kind: "message", T: SessionResponse_GetSessionUsageResponse, oneof: "response" }
    ]
  );
  var SessionResponse_Pong = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.Pong",
    [],
    { localName: "SessionResponse_Pong" }
  );
  var SessionResponse_GetChatHistoryResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.GetChatHistoryResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: ChatContext_ChatItem, repeated: true }
    ],
    { localName: "SessionResponse_GetChatHistoryResponse" }
  );
  var SessionResponse_GetAgentInfoResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.GetAgentInfoResponse",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "instructions", kind: "scalar", T: 9, opt: true },
      { no: 3, name: "tools", kind: "scalar", T: 9, repeated: true },
      { no: 4, name: "chat_ctx", kind: "message", T: ChatContext_ChatItem, repeated: true }
    ],
    { localName: "SessionResponse_GetAgentInfoResponse" }
  );
  var SessionResponse_RunInputResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.RunInputResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: ChatContext_ChatItem, repeated: true }
    ],
    { localName: "SessionResponse_RunInputResponse" }
  );
  var SessionResponse_GetSessionStateResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.GetSessionStateResponse",
    () => [
      { no: 1, name: "agent_state", kind: "enum", T: proto3.getEnumType(AgentState) },
      { no: 2, name: "user_state", kind: "enum", T: proto3.getEnumType(UserState) },
      {
        no: 3,
        name: "agent_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "options", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 5, name: "created_at", kind: "message", T: Timestamp }
    ],
    { localName: "SessionResponse_GetSessionStateResponse" }
  );
  var SessionResponse_GetRTCStatsResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.GetRTCStatsResponse",
    () => [
      { no: 1, name: "publisher_stats", kind: "message", T: Struct, repeated: true },
      { no: 2, name: "subscriber_stats", kind: "message", T: Struct, repeated: true }
    ],
    { localName: "SessionResponse_GetRTCStatsResponse" }
  );
  var SessionResponse_GetSessionUsageResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.SessionResponse.GetSessionUsageResponse",
    () => [
      { no: 1, name: "usage", kind: "message", T: AgentSessionUsage },
      { no: 2, name: "created_at", kind: "message", T: Timestamp }
    ],
    { localName: "SessionResponse_GetSessionUsageResponse" }
  );
  var AgentSessionMessage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage",
    () => [
      { no: 1, name: "audio_input", kind: "message", T: AgentSessionMessage_ConsoleIO_AudioFrame, oneof: "message" },
      { no: 2, name: "audio_output", kind: "message", T: AgentSessionMessage_ConsoleIO_AudioFrame, oneof: "message" },
      { no: 3, name: "event", kind: "message", T: AgentSessionEvent, oneof: "message" },
      { no: 4, name: "request", kind: "message", T: SessionRequest, oneof: "message" },
      { no: 5, name: "response", kind: "message", T: SessionResponse, oneof: "message" },
      { no: 6, name: "audio_playback_flush", kind: "message", T: AgentSessionMessage_ConsoleIO_AudioPlaybackFlush, oneof: "message" },
      { no: 7, name: "audio_playback_clear", kind: "message", T: AgentSessionMessage_ConsoleIO_AudioPlaybackClear, oneof: "message" },
      { no: 8, name: "audio_playback_finished", kind: "message", T: AgentSessionMessage_ConsoleIO_AudioPlaybackFinished, oneof: "message" }
    ]
  );
  var AgentSessionMessage_ConsoleIO = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage.ConsoleIO",
    [],
    { localName: "AgentSessionMessage_ConsoleIO" }
  );
  var AgentSessionMessage_ConsoleIO_AudioFrame = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage.ConsoleIO.AudioFrame",
    () => [
      {
        no: 1,
        name: "data",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      {
        no: 2,
        name: "sample_rate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "num_channels",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "samples_per_channel",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ],
    { localName: "AgentSessionMessage_ConsoleIO_AudioFrame" }
  );
  var AgentSessionMessage_ConsoleIO_AudioPlaybackFlush = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage.ConsoleIO.AudioPlaybackFlush",
    [],
    { localName: "AgentSessionMessage_ConsoleIO_AudioPlaybackFlush" }
  );
  var AgentSessionMessage_ConsoleIO_AudioPlaybackClear = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage.ConsoleIO.AudioPlaybackClear",
    [],
    { localName: "AgentSessionMessage_ConsoleIO_AudioPlaybackClear" }
  );
  var AgentSessionMessage_ConsoleIO_AudioPlaybackFinished = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.agent.AgentSessionMessage.ConsoleIO.AudioPlaybackFinished",
    [],
    { localName: "AgentSessionMessage_ConsoleIO_AudioPlaybackFinished" }
  );
  var livekit_agent_session_pb = {
    __proto__: null,
    AgentConfigUpdate,
    AgentHandoff,
    AgentSessionEvent,
    AgentSessionEvent_AgentStateChanged,
    AgentSessionEvent_ConversationItemAdded,
    AgentSessionEvent_Error,
    AgentSessionEvent_FunctionToolsExecuted,
    AgentSessionEvent_OverlappingSpeech,
    AgentSessionEvent_SessionUsageUpdated,
    AgentSessionEvent_UserInputTranscribed,
    AgentSessionEvent_UserStateChanged,
    AgentSessionMessage,
    AgentSessionMessage_ConsoleIO,
    AgentSessionMessage_ConsoleIO_AudioFrame,
    AgentSessionMessage_ConsoleIO_AudioPlaybackClear,
    AgentSessionMessage_ConsoleIO_AudioPlaybackFinished,
    AgentSessionMessage_ConsoleIO_AudioPlaybackFlush,
    AgentSessionUsage,
    AgentState,
    ChatContext,
    ChatContext_ChatItem,
    ChatMessage: ChatMessage$1,
    ChatMessage_ChatContent,
    ChatRole,
    FunctionCall,
    FunctionCallOutput,
    InterruptionModelUsage,
    LLMModelUsage,
    MetricsReport,
    ModelUsage,
    STTModelUsage,
    SessionRequest,
    SessionRequest_GetAgentInfo,
    SessionRequest_GetChatHistory,
    SessionRequest_GetRTCStats,
    SessionRequest_GetSessionState,
    SessionRequest_GetSessionUsage,
    SessionRequest_Ping,
    SessionRequest_RunInput,
    SessionResponse,
    SessionResponse_GetAgentInfoResponse,
    SessionResponse_GetChatHistoryResponse,
    SessionResponse_GetRTCStatsResponse,
    SessionResponse_GetSessionStateResponse,
    SessionResponse_GetSessionUsageResponse,
    SessionResponse_Pong,
    SessionResponse_RunInputResponse,
    TTSModelUsage,
    UserState
  };
  var MetricLabel = /* @__PURE__ */ proto3.makeEnum(
    "livekit.MetricLabel",
    [
      { no: 0, name: "AGENTS_LLM_TTFT" },
      { no: 1, name: "AGENTS_STT_TTFT" },
      { no: 2, name: "AGENTS_TTS_TTFB" },
      { no: 3, name: "CLIENT_VIDEO_SUBSCRIBER_FREEZE_COUNT" },
      { no: 4, name: "CLIENT_VIDEO_SUBSCRIBER_TOTAL_FREEZE_DURATION" },
      { no: 5, name: "CLIENT_VIDEO_SUBSCRIBER_PAUSE_COUNT" },
      { no: 6, name: "CLIENT_VIDEO_SUBSCRIBER_TOTAL_PAUSES_DURATION" },
      { no: 7, name: "CLIENT_AUDIO_SUBSCRIBER_CONCEALED_SAMPLES" },
      { no: 8, name: "CLIENT_AUDIO_SUBSCRIBER_SILENT_CONCEALED_SAMPLES" },
      { no: 9, name: "CLIENT_AUDIO_SUBSCRIBER_CONCEALMENT_EVENTS" },
      { no: 10, name: "CLIENT_AUDIO_SUBSCRIBER_INTERRUPTION_COUNT" },
      { no: 11, name: "CLIENT_AUDIO_SUBSCRIBER_TOTAL_INTERRUPTION_DURATION" },
      { no: 12, name: "CLIENT_SUBSCRIBER_JITTER_BUFFER_DELAY" },
      { no: 13, name: "CLIENT_SUBSCRIBER_JITTER_BUFFER_EMITTED_COUNT" },
      { no: 14, name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_BANDWIDTH" },
      { no: 15, name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_CPU" },
      { no: 16, name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_OTHER" },
      { no: 17, name: "PUBLISHER_RTT" },
      { no: 18, name: "SERVER_MESH_RTT" },
      { no: 19, name: "SUBSCRIBER_RTT" },
      { no: 4096, name: "METRIC_LABEL_PREDEFINED_MAX_VALUE" }
    ]
  );
  var MetricsBatch = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MetricsBatch",
    () => [
      {
        no: 1,
        name: "timestamp_ms",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 2, name: "normalized_timestamp", kind: "message", T: Timestamp },
      { no: 3, name: "str_data", kind: "scalar", T: 9, repeated: true },
      { no: 4, name: "time_series", kind: "message", T: TimeSeriesMetric, repeated: true },
      { no: 5, name: "events", kind: "message", T: EventMetric, repeated: true }
    ]
  );
  var TimeSeriesMetric = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TimeSeriesMetric",
    () => [
      {
        no: 1,
        name: "label",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "participant_identity",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "track_sid",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 4, name: "samples", kind: "message", T: MetricSample, repeated: true },
      {
        no: 5,
        name: "rid",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var MetricSample = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MetricSample",
    () => [
      {
        no: 1,
        name: "timestamp_ms",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 2, name: "normalized_timestamp", kind: "message", T: Timestamp },
      {
        no: 3,
        name: "value",
        kind: "scalar",
        T: 2
        /* ScalarType.FLOAT */
      }
    ]
  );
  var EventMetric = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EventMetric",
    () => [
      {
        no: 1,
        name: "label",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "participant_identity",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "track_sid",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "start_timestamp_ms",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 5, name: "end_timestamp_ms", kind: "scalar", T: 3, opt: true },
      { no: 6, name: "normalized_start_timestamp", kind: "message", T: Timestamp },
      { no: 7, name: "normalized_end_timestamp", kind: "message", T: Timestamp, opt: true },
      {
        no: 8,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "rid",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var MetricsRecordingHeader = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MetricsRecordingHeader",
    () => [
      {
        no: 1,
        name: "room_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "duration",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      { no: 4, name: "start_time", kind: "message", T: Timestamp },
      { no: 5, name: "room_tags", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } }
    ]
  );
  var AudioCodec = /* @__PURE__ */ proto3.makeEnum(
    "livekit.AudioCodec",
    [
      { no: 0, name: "DEFAULT_AC" },
      { no: 1, name: "OPUS" },
      { no: 2, name: "AAC" },
      { no: 3, name: "AC_MP3" }
    ]
  );
  var VideoCodec = /* @__PURE__ */ proto3.makeEnum(
    "livekit.VideoCodec",
    [
      { no: 0, name: "DEFAULT_VC" },
      { no: 1, name: "H264_BASELINE" },
      { no: 2, name: "H264_MAIN" },
      { no: 3, name: "H264_HIGH" },
      { no: 4, name: "VP8" }
    ]
  );
  var ImageCodec = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ImageCodec",
    [
      { no: 0, name: "IC_DEFAULT" },
      { no: 1, name: "IC_JPEG" }
    ]
  );
  var BackupCodecPolicy = /* @__PURE__ */ proto3.makeEnum(
    "livekit.BackupCodecPolicy",
    [
      { no: 0, name: "PREFER_REGRESSION" },
      { no: 1, name: "SIMULCAST" },
      { no: 2, name: "REGRESSION" }
    ]
  );
  var TrackType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.TrackType",
    [
      { no: 0, name: "AUDIO" },
      { no: 1, name: "VIDEO" },
      { no: 2, name: "DATA" }
    ]
  );
  var TrackSource = /* @__PURE__ */ proto3.makeEnum(
    "livekit.TrackSource",
    [
      { no: 0, name: "UNKNOWN" },
      { no: 1, name: "CAMERA" },
      { no: 2, name: "MICROPHONE" },
      { no: 3, name: "SCREEN_SHARE" },
      { no: 4, name: "SCREEN_SHARE_AUDIO" }
    ]
  );
  var DataTrackExtensionID = /* @__PURE__ */ proto3.makeEnum(
    "livekit.DataTrackExtensionID",
    [
      { no: 0, name: "DTEI_INVALID" },
      { no: 1, name: "DTEI_PARTICIPANT_SID" }
    ]
  );
  var VideoQuality = /* @__PURE__ */ proto3.makeEnum(
    "livekit.VideoQuality",
    [
      { no: 0, name: "LOW" },
      { no: 1, name: "MEDIUM" },
      { no: 2, name: "HIGH" },
      { no: 3, name: "OFF" }
    ]
  );
  var ConnectionQuality = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ConnectionQuality",
    [
      { no: 0, name: "POOR" },
      { no: 1, name: "GOOD" },
      { no: 2, name: "EXCELLENT" },
      { no: 3, name: "LOST" }
    ]
  );
  var ClientConfigSetting = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ClientConfigSetting",
    [
      { no: 0, name: "UNSET" },
      { no: 1, name: "DISABLED" },
      { no: 2, name: "ENABLED" }
    ]
  );
  var DisconnectReason = /* @__PURE__ */ proto3.makeEnum(
    "livekit.DisconnectReason",
    [
      { no: 0, name: "UNKNOWN_REASON" },
      { no: 1, name: "CLIENT_INITIATED" },
      { no: 2, name: "DUPLICATE_IDENTITY" },
      { no: 3, name: "SERVER_SHUTDOWN" },
      { no: 4, name: "PARTICIPANT_REMOVED" },
      { no: 5, name: "ROOM_DELETED" },
      { no: 6, name: "STATE_MISMATCH" },
      { no: 7, name: "JOIN_FAILURE" },
      { no: 8, name: "MIGRATION" },
      { no: 9, name: "SIGNAL_CLOSE" },
      { no: 10, name: "ROOM_CLOSED" },
      { no: 11, name: "USER_UNAVAILABLE" },
      { no: 12, name: "USER_REJECTED" },
      { no: 13, name: "SIP_TRUNK_FAILURE" },
      { no: 14, name: "CONNECTION_TIMEOUT" },
      { no: 15, name: "MEDIA_FAILURE" },
      { no: 16, name: "AGENT_ERROR" }
    ]
  );
  var ReconnectReason = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ReconnectReason",
    [
      { no: 0, name: "RR_UNKNOWN" },
      { no: 1, name: "RR_SIGNAL_DISCONNECTED" },
      { no: 2, name: "RR_PUBLISHER_FAILED" },
      { no: 3, name: "RR_SUBSCRIBER_FAILED" },
      { no: 4, name: "RR_SWITCH_CANDIDATE" }
    ]
  );
  var SubscriptionError = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SubscriptionError",
    [
      { no: 0, name: "SE_UNKNOWN" },
      { no: 1, name: "SE_CODEC_UNSUPPORTED" },
      { no: 2, name: "SE_TRACK_NOTFOUND" }
    ]
  );
  var AudioTrackFeature = /* @__PURE__ */ proto3.makeEnum(
    "livekit.AudioTrackFeature",
    [
      { no: 0, name: "TF_STEREO" },
      { no: 1, name: "TF_NO_DTX" },
      { no: 2, name: "TF_AUTO_GAIN_CONTROL" },
      { no: 3, name: "TF_ECHO_CANCELLATION" },
      { no: 4, name: "TF_NOISE_SUPPRESSION" },
      { no: 5, name: "TF_ENHANCED_NOISE_CANCELLATION" },
      { no: 6, name: "TF_PRECONNECT_BUFFER" }
    ]
  );
  var PacketTrailerFeature = /* @__PURE__ */ proto3.makeEnum(
    "livekit.PacketTrailerFeature",
    [
      { no: 0, name: "PTF_USER_TIMESTAMP" }
    ]
  );
  var Pagination = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Pagination",
    () => [
      {
        no: 1,
        name: "after_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "limit",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var TokenPagination = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TokenPagination",
    () => [
      {
        no: 1,
        name: "token",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ListUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListUpdate",
    () => [
      { no: 1, name: "set", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "add", kind: "scalar", T: 9, repeated: true },
      { no: 3, name: "remove", kind: "scalar", T: 9, repeated: true },
      {
        no: 4,
        name: "clear",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var Room = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Room",
    () => [
      {
        no: 1,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "empty_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 14,
        name: "departure_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "max_participants",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "creation_time",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 15,
        name: "creation_time_ms",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "turn_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 7, name: "enabled_codecs", kind: "message", T: Codec, repeated: true },
      {
        no: 8,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "num_participants",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 11,
        name: "num_publishers",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 10,
        name: "active_recording",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 13, name: "version", kind: "message", T: TimedVersion }
    ]
  );
  var Codec = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Codec",
    () => [
      {
        no: 1,
        name: "mime",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "fmtp_line",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var PlayoutDelay = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.PlayoutDelay",
    () => [
      {
        no: 1,
        name: "enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 2,
        name: "min",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "max",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var ParticipantPermission = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ParticipantPermission",
    () => [
      {
        no: 1,
        name: "can_subscribe",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 2,
        name: "can_publish",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 3,
        name: "can_publish_data",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 9, name: "can_publish_sources", kind: "enum", T: proto3.getEnumType(TrackSource), repeated: true },
      {
        no: 7,
        name: "hidden",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 8,
        name: "recorder",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 10,
        name: "can_update_metadata",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 11,
        name: "agent",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 12,
        name: "can_subscribe_metrics",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 13,
        name: "can_manage_agent_session",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var ParticipantInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ParticipantInfo",
    () => [
      {
        no: 1,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "state", kind: "enum", T: proto3.getEnumType(ParticipantInfo_State) },
      { no: 4, name: "tracks", kind: "message", T: TrackInfo, repeated: true },
      {
        no: 5,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "joined_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 17,
        name: "joined_at_ms",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 9,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "version",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 11, name: "permission", kind: "message", T: ParticipantPermission },
      {
        no: 12,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 13,
        name: "is_publisher",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 14, name: "kind", kind: "enum", T: proto3.getEnumType(ParticipantInfo_Kind) },
      { no: 15, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 16, name: "disconnect_reason", kind: "enum", T: proto3.getEnumType(DisconnectReason) },
      { no: 18, name: "kind_details", kind: "enum", T: proto3.getEnumType(ParticipantInfo_KindDetail), repeated: true },
      { no: 19, name: "data_tracks", kind: "message", T: DataTrackInfo, repeated: true },
      {
        no: 20,
        name: "client_protocol",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var ParticipantInfo_State = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ParticipantInfo.State",
    [
      { no: 0, name: "JOINING" },
      { no: 1, name: "JOINED" },
      { no: 2, name: "ACTIVE" },
      { no: 3, name: "DISCONNECTED" }
    ]
  );
  var ParticipantInfo_Kind = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ParticipantInfo.Kind",
    [
      { no: 0, name: "STANDARD" },
      { no: 1, name: "INGRESS" },
      { no: 2, name: "EGRESS" },
      { no: 3, name: "SIP" },
      { no: 4, name: "AGENT" },
      { no: 7, name: "CONNECTOR" },
      { no: 8, name: "BRIDGE" }
    ]
  );
  var ParticipantInfo_KindDetail = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ParticipantInfo.KindDetail",
    [
      { no: 0, name: "CLOUD_AGENT" },
      { no: 1, name: "FORWARDED" },
      { no: 2, name: "CONNECTOR_WHATSAPP" },
      { no: 3, name: "CONNECTOR_TWILIO" },
      { no: 4, name: "BRIDGE_RTSP" }
    ]
  );
  var Encryption = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Encryption",
    []
  );
  var Encryption_Type = /* @__PURE__ */ proto3.makeEnum(
    "livekit.Encryption.Type",
    [
      { no: 0, name: "NONE" },
      { no: 1, name: "GCM" },
      { no: 2, name: "CUSTOM" }
    ]
  );
  var SimulcastCodecInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SimulcastCodecInfo",
    () => [
      {
        no: 1,
        name: "mime_type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "mid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "cid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "layers", kind: "message", T: VideoLayer, repeated: true },
      { no: 5, name: "video_layer_mode", kind: "enum", T: proto3.getEnumType(VideoLayer_Mode) },
      {
        no: 6,
        name: "sdp_cid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var TrackInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackInfo",
    () => [
      {
        no: 1,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
      {
        no: 3,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "muted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 5,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 6,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 7,
        name: "simulcast",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 8,
        name: "disable_dtx",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 9, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
      { no: 10, name: "layers", kind: "message", T: VideoLayer, repeated: true },
      {
        no: 11,
        name: "mime_type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "mid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 13, name: "codecs", kind: "message", T: SimulcastCodecInfo, repeated: true },
      {
        no: 14,
        name: "stereo",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 15,
        name: "disable_red",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 16, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
      {
        no: 17,
        name: "stream",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 18, name: "version", kind: "message", T: TimedVersion },
      { no: 19, name: "audio_features", kind: "enum", T: proto3.getEnumType(AudioTrackFeature), repeated: true },
      { no: 20, name: "backup_codec_policy", kind: "enum", T: proto3.getEnumType(BackupCodecPolicy) },
      { no: 21, name: "packet_trailer_features", kind: "enum", T: proto3.getEnumType(PacketTrailerFeature), repeated: true }
    ]
  );
  var DataTrackInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataTrackInfo",
    () => [
      {
        no: 1,
        name: "pub_handle",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) }
    ]
  );
  var DataTrackExtensionParticipantSid = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataTrackExtensionParticipantSid",
    () => [
      { no: 1, name: "id", kind: "enum", T: proto3.getEnumType(DataTrackExtensionID) },
      {
        no: 2,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var DataTrackSubscriptionOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataTrackSubscriptionOptions",
    () => [
      { no: 1, name: "target_fps", kind: "scalar", T: 13, opt: true }
    ]
  );
  var VideoLayer = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.VideoLayer",
    () => [
      { no: 1, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
      {
        no: 2,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "bitrate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "ssrc",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 6,
        name: "spatial_layer",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 7,
        name: "rid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "repair_ssrc",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var VideoLayer_Mode = /* @__PURE__ */ proto3.makeEnum(
    "livekit.VideoLayer.Mode",
    [
      { no: 0, name: "MODE_UNUSED" },
      { no: 1, name: "ONE_SPATIAL_LAYER_PER_STREAM" },
      { no: 2, name: "MULTIPLE_SPATIAL_LAYERS_PER_STREAM" },
      { no: 3, name: "ONE_SPATIAL_LAYER_PER_STREAM_INCOMPLETE_RTCP_SR" }
    ]
  );
  var DataPacket = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataPacket",
    () => [
      { no: 1, name: "kind", kind: "enum", T: proto3.getEnumType(DataPacket_Kind) },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "destination_identities", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "user", kind: "message", T: UserPacket, oneof: "value" },
      { no: 3, name: "speaker", kind: "message", T: ActiveSpeakerUpdate, oneof: "value" },
      { no: 6, name: "sip_dtmf", kind: "message", T: SipDTMF, oneof: "value" },
      { no: 7, name: "transcription", kind: "message", T: Transcription, oneof: "value" },
      { no: 8, name: "metrics", kind: "message", T: MetricsBatch, oneof: "value" },
      { no: 9, name: "chat_message", kind: "message", T: ChatMessage, oneof: "value" },
      { no: 10, name: "rpc_request", kind: "message", T: RpcRequest, oneof: "value" },
      { no: 11, name: "rpc_ack", kind: "message", T: RpcAck, oneof: "value" },
      { no: 12, name: "rpc_response", kind: "message", T: RpcResponse, oneof: "value" },
      { no: 13, name: "stream_header", kind: "message", T: DataStream_Header, oneof: "value" },
      { no: 14, name: "stream_chunk", kind: "message", T: DataStream_Chunk, oneof: "value" },
      { no: 15, name: "stream_trailer", kind: "message", T: DataStream_Trailer, oneof: "value" },
      { no: 18, name: "encrypted_packet", kind: "message", T: EncryptedPacket, oneof: "value" },
      {
        no: 16,
        name: "sequence",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 17,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var DataPacket_Kind = /* @__PURE__ */ proto3.makeEnum(
    "livekit.DataPacket.Kind",
    [
      { no: 0, name: "RELIABLE" },
      { no: 1, name: "LOSSY" }
    ]
  );
  var EncryptedPacket = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EncryptedPacket",
    () => [
      { no: 1, name: "encryption_type", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
      {
        no: 2,
        name: "iv",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      {
        no: 3,
        name: "key_index",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "encrypted_value",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]
  );
  var EncryptedPacketPayload = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EncryptedPacketPayload",
    () => [
      { no: 1, name: "user", kind: "message", T: UserPacket, oneof: "value" },
      { no: 3, name: "chat_message", kind: "message", T: ChatMessage, oneof: "value" },
      { no: 4, name: "rpc_request", kind: "message", T: RpcRequest, oneof: "value" },
      { no: 5, name: "rpc_ack", kind: "message", T: RpcAck, oneof: "value" },
      { no: 6, name: "rpc_response", kind: "message", T: RpcResponse, oneof: "value" },
      { no: 7, name: "stream_header", kind: "message", T: DataStream_Header, oneof: "value" },
      { no: 8, name: "stream_chunk", kind: "message", T: DataStream_Chunk, oneof: "value" },
      { no: 9, name: "stream_trailer", kind: "message", T: DataStream_Trailer, oneof: "value" }
    ]
  );
  var ActiveSpeakerUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ActiveSpeakerUpdate",
    () => [
      { no: 1, name: "speakers", kind: "message", T: SpeakerInfo, repeated: true }
    ]
  );
  var SpeakerInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SpeakerInfo",
    () => [
      {
        no: 1,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "level",
        kind: "scalar",
        T: 2
        /* ScalarType.FLOAT */
      },
      {
        no: 3,
        name: "active",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var UserPacket = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UserPacket",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "payload",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      { no: 3, name: "destination_sids", kind: "scalar", T: 9, repeated: true },
      { no: 6, name: "destination_identities", kind: "scalar", T: 9, repeated: true },
      { no: 4, name: "topic", kind: "scalar", T: 9, opt: true },
      { no: 8, name: "id", kind: "scalar", T: 9, opt: true },
      { no: 9, name: "start_time", kind: "scalar", T: 4, opt: true },
      { no: 10, name: "end_time", kind: "scalar", T: 4, opt: true },
      {
        no: 11,
        name: "nonce",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]
  );
  var SipDTMF = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SipDTMF",
    () => [
      {
        no: 3,
        name: "code",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "digit",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var Transcription = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Transcription",
    () => [
      {
        no: 2,
        name: "transcribed_participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "track_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "segments", kind: "message", T: TranscriptionSegment, repeated: true }
    ]
  );
  var TranscriptionSegment = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TranscriptionSegment",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "start_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 4,
        name: "end_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "final",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 6,
        name: "language",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ChatMessage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ChatMessage",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 3, name: "edit_timestamp", kind: "scalar", T: 3, opt: true },
      {
        no: 4,
        name: "message",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "deleted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 6,
        name: "generated",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var RpcRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RpcRequest",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "method",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "payload",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "response_timeout_ms",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "version",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 6,
        name: "compressed_payload",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]
  );
  var RpcAck = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RpcAck",
    () => [
      {
        no: 1,
        name: "request_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var RpcResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RpcResponse",
    () => [
      {
        no: 1,
        name: "request_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "payload", kind: "scalar", T: 9, oneof: "value" },
      { no: 3, name: "error", kind: "message", T: RpcError, oneof: "value" },
      { no: 4, name: "compressed_payload", kind: "scalar", T: 12, oneof: "value" }
    ]
  );
  var RpcError = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RpcError",
    () => [
      {
        no: 1,
        name: "code",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "message",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "data",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ParticipantTracks = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ParticipantTracks",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "track_sids", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ServerInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ServerInfo",
    () => [
      { no: 1, name: "edition", kind: "enum", T: proto3.getEnumType(ServerInfo_Edition) },
      {
        no: 2,
        name: "version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "protocol",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "node_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "debug_info",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "agent_protocol",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var ServerInfo_Edition = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ServerInfo.Edition",
    [
      { no: 0, name: "Standard" },
      { no: 1, name: "Cloud" }
    ]
  );
  var ClientInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ClientInfo",
    () => [
      { no: 1, name: "sdk", kind: "enum", T: proto3.getEnumType(ClientInfo_SDK) },
      {
        no: 2,
        name: "version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "protocol",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "os",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "os_version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "device_model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "browser",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "browser_version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "address",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "network",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "other_sdks",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "client_protocol",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var ClientInfo_SDK = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ClientInfo.SDK",
    [
      { no: 0, name: "UNKNOWN" },
      { no: 1, name: "JS" },
      { no: 2, name: "SWIFT" },
      { no: 3, name: "ANDROID" },
      { no: 4, name: "FLUTTER" },
      { no: 5, name: "GO" },
      { no: 6, name: "UNITY" },
      { no: 7, name: "REACT_NATIVE" },
      { no: 8, name: "RUST" },
      { no: 9, name: "PYTHON" },
      { no: 10, name: "CPP" },
      { no: 11, name: "UNITY_WEB" },
      { no: 12, name: "NODE" },
      { no: 13, name: "UNREAL" },
      { no: 14, name: "ESP32" }
    ]
  );
  var ClientConfiguration = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ClientConfiguration",
    () => [
      { no: 1, name: "video", kind: "message", T: VideoConfiguration },
      { no: 2, name: "screen", kind: "message", T: VideoConfiguration },
      { no: 3, name: "resume_connection", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) },
      { no: 4, name: "disabled_codecs", kind: "message", T: DisabledCodecs },
      { no: 5, name: "force_relay", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) }
    ]
  );
  var VideoConfiguration = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.VideoConfiguration",
    () => [
      { no: 1, name: "hardware_encoder", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) }
    ]
  );
  var DisabledCodecs = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DisabledCodecs",
    () => [
      { no: 1, name: "codecs", kind: "message", T: Codec, repeated: true },
      { no: 2, name: "publish", kind: "message", T: Codec, repeated: true }
    ]
  );
  var RTPDrift = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RTPDrift",
    () => [
      { no: 1, name: "start_time", kind: "message", T: Timestamp },
      { no: 2, name: "end_time", kind: "message", T: Timestamp },
      {
        no: 3,
        name: "duration",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 4,
        name: "start_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "end_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 6,
        name: "rtp_clock_ticks",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 7,
        name: "drift_samples",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 8,
        name: "drift_ms",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 9,
        name: "clock_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var RTPStats = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RTPStats",
    () => [
      { no: 1, name: "start_time", kind: "message", T: Timestamp },
      { no: 2, name: "end_time", kind: "message", T: Timestamp },
      {
        no: 3,
        name: "duration",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 4,
        name: "packets",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "packet_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 6,
        name: "bytes",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 39,
        name: "header_bytes",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 7,
        name: "bitrate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 8,
        name: "packets_lost",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 9,
        name: "packet_loss_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 10,
        name: "packet_loss_percentage",
        kind: "scalar",
        T: 2
        /* ScalarType.FLOAT */
      },
      {
        no: 11,
        name: "packets_duplicate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 12,
        name: "packet_duplicate_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 13,
        name: "bytes_duplicate",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 40,
        name: "header_bytes_duplicate",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 14,
        name: "bitrate_duplicate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 15,
        name: "packets_padding",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 16,
        name: "packet_padding_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 17,
        name: "bytes_padding",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 41,
        name: "header_bytes_padding",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 18,
        name: "bitrate_padding",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 19,
        name: "packets_out_of_order",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 20,
        name: "frames",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 21,
        name: "frame_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 22,
        name: "jitter_current",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 23,
        name: "jitter_max",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      { no: 24, name: "gap_histogram", kind: "map", K: 5, V: {
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      } },
      {
        no: 25,
        name: "nacks",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 37,
        name: "nack_acks",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 26,
        name: "nack_misses",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 38,
        name: "nack_repeated",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 27,
        name: "plis",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 28, name: "last_pli", kind: "message", T: Timestamp },
      {
        no: 29,
        name: "firs",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 30, name: "last_fir", kind: "message", T: Timestamp },
      {
        no: 31,
        name: "rtt_current",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 32,
        name: "rtt_max",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 33,
        name: "key_frames",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 34, name: "last_key_frame", kind: "message", T: Timestamp },
      {
        no: 35,
        name: "layer_lock_plis",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 36, name: "last_layer_lock_pli", kind: "message", T: Timestamp },
      { no: 44, name: "packet_drift", kind: "message", T: RTPDrift },
      { no: 45, name: "ntp_report_drift", kind: "message", T: RTPDrift },
      { no: 46, name: "rebased_report_drift", kind: "message", T: RTPDrift },
      { no: 47, name: "received_report_drift", kind: "message", T: RTPDrift }
    ]
  );
  var RTCPSenderReportState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RTCPSenderReportState",
    () => [
      {
        no: 1,
        name: "rtp_timestamp",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "rtp_timestamp_ext",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 3,
        name: "ntp_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 4,
        name: "at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 5,
        name: "at_adjusted",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "packets",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 7,
        name: "octets",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      }
    ]
  );
  var RTPForwarderState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RTPForwarderState",
    () => [
      {
        no: 1,
        name: "started",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 2,
        name: "reference_layer_spatial",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 3,
        name: "pre_start_time",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 4,
        name: "ext_first_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "dummy_start_timestamp_offset",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      { no: 6, name: "rtp_munger", kind: "message", T: RTPMungerState },
      { no: 7, name: "vp8_munger", kind: "message", T: VP8MungerState, oneof: "codec_munger" },
      { no: 8, name: "sender_report_state", kind: "message", T: RTCPSenderReportState, repeated: true }
    ]
  );
  var RTPMungerState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RTPMungerState",
    () => [
      {
        no: 1,
        name: "ext_last_sequence_number",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 2,
        name: "ext_second_last_sequence_number",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 3,
        name: "ext_last_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 4,
        name: "ext_second_last_timestamp",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "last_marker",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 6,
        name: "second_last_marker",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var VP8MungerState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.VP8MungerState",
    () => [
      {
        no: 1,
        name: "ext_last_picture_id",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 2,
        name: "picture_id_used",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 3,
        name: "last_tl0_pic_idx",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "tl0_pic_idx_used",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 5,
        name: "tid_used",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 6,
        name: "last_key_idx",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 7,
        name: "key_idx_used",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var TimedVersion = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TimedVersion",
    () => [
      {
        no: 1,
        name: "unix_micro",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 2,
        name: "ticks",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var DataStream = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream",
    []
  );
  var DataStream_OperationType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.DataStream.OperationType",
    [
      { no: 0, name: "CREATE" },
      { no: 1, name: "UPDATE" },
      { no: 2, name: "DELETE" },
      { no: 3, name: "REACTION" }
    ]
  );
  var DataStream_TextHeader = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream.TextHeader",
    () => [
      { no: 1, name: "operation_type", kind: "enum", T: proto3.getEnumType(DataStream_OperationType) },
      {
        no: 2,
        name: "version",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 3,
        name: "reply_to_stream_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "attached_stream_ids", kind: "scalar", T: 9, repeated: true },
      {
        no: 5,
        name: "generated",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ],
    { localName: "DataStream_TextHeader" }
  );
  var DataStream_ByteHeader = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream.ByteHeader",
    () => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ],
    { localName: "DataStream_ByteHeader" }
  );
  var DataStream_Header = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream.Header",
    () => [
      {
        no: 1,
        name: "stream_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "topic",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "mime_type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "total_length", kind: "scalar", T: 4, opt: true },
      { no: 7, name: "encryption_type", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
      { no: 8, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 9, name: "text_header", kind: "message", T: DataStream_TextHeader, oneof: "content_header" },
      { no: 10, name: "byte_header", kind: "message", T: DataStream_ByteHeader, oneof: "content_header" }
    ],
    { localName: "DataStream_Header" }
  );
  var DataStream_Chunk = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream.Chunk",
    () => [
      {
        no: 1,
        name: "stream_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "chunk_index",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 3,
        name: "content",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      {
        no: 4,
        name: "version",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      { no: 5, name: "iv", kind: "scalar", T: 12, opt: true }
    ],
    { localName: "DataStream_Chunk" }
  );
  var DataStream_Trailer = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataStream.Trailer",
    () => [
      {
        no: 1,
        name: "stream_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "reason",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } }
    ],
    { localName: "DataStream_Trailer" }
  );
  var FilterParams = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.FilterParams",
    () => [
      { no: 1, name: "include_events", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "exclude_events", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var WebhookConfig = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WebhookConfig",
    () => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "signing_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "filter_params", kind: "message", T: FilterParams }
    ]
  );
  var SubscribedAudioCodec = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscribedAudioCodec",
    () => [
      {
        no: 1,
        name: "codec",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var JobType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.JobType",
    [
      { no: 0, name: "JT_ROOM" },
      { no: 1, name: "JT_PUBLISHER" },
      { no: 2, name: "JT_PARTICIPANT" }
    ]
  );
  var WorkerStatus = /* @__PURE__ */ proto3.makeEnum(
    "livekit.WorkerStatus",
    [
      { no: 0, name: "WS_AVAILABLE" },
      { no: 1, name: "WS_FULL" }
    ]
  );
  var JobStatus = /* @__PURE__ */ proto3.makeEnum(
    "livekit.JobStatus",
    [
      { no: 0, name: "JS_PENDING" },
      { no: 1, name: "JS_RUNNING" },
      { no: 2, name: "JS_SUCCESS" },
      { no: 3, name: "JS_FAILED" }
    ]
  );
  var Job = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Job",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "dispatch_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(JobType) },
      { no: 3, name: "room", kind: "message", T: Room },
      { no: 4, name: "participant", kind: "message", T: ParticipantInfo, opt: true },
      {
        no: 5,
        name: "namespace",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "agent_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 8, name: "state", kind: "message", T: JobState },
      {
        no: 10,
        name: "enable_recording",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var JobState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.JobState",
    () => [
      { no: 1, name: "status", kind: "enum", T: proto3.getEnumType(JobStatus) },
      {
        no: 2,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 4,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 5,
        name: "updated_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "worker_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "agent_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var WorkerMessage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WorkerMessage",
    () => [
      { no: 1, name: "register", kind: "message", T: RegisterWorkerRequest, oneof: "message" },
      { no: 2, name: "availability", kind: "message", T: AvailabilityResponse, oneof: "message" },
      { no: 3, name: "update_worker", kind: "message", T: UpdateWorkerStatus, oneof: "message" },
      { no: 4, name: "update_job", kind: "message", T: UpdateJobStatus, oneof: "message" },
      { no: 5, name: "ping", kind: "message", T: WorkerPing, oneof: "message" },
      { no: 6, name: "simulate_job", kind: "message", T: SimulateJobRequest, oneof: "message" },
      { no: 7, name: "migrate_job", kind: "message", T: MigrateJobRequest, oneof: "message" }
    ]
  );
  var ServerMessage = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ServerMessage",
    () => [
      { no: 1, name: "register", kind: "message", T: RegisterWorkerResponse, oneof: "message" },
      { no: 2, name: "availability", kind: "message", T: AvailabilityRequest, oneof: "message" },
      { no: 3, name: "assignment", kind: "message", T: JobAssignment, oneof: "message" },
      { no: 5, name: "termination", kind: "message", T: JobTermination, oneof: "message" },
      { no: 4, name: "pong", kind: "message", T: WorkerPong, oneof: "message" }
    ]
  );
  var SimulateJobRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SimulateJobRequest",
    () => [
      { no: 1, name: "type", kind: "enum", T: proto3.getEnumType(JobType) },
      { no: 2, name: "room", kind: "message", T: Room },
      { no: 3, name: "participant", kind: "message", T: ParticipantInfo }
    ]
  );
  var WorkerPing = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WorkerPing",
    () => [
      {
        no: 1,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var WorkerPong = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WorkerPong",
    () => [
      {
        no: 1,
        name: "last_timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var RegisterWorkerRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RegisterWorkerRequest",
    () => [
      { no: 1, name: "type", kind: "enum", T: proto3.getEnumType(JobType) },
      {
        no: 8,
        name: "agent_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "ping_interval",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 6, name: "namespace", kind: "scalar", T: 9, opt: true },
      { no: 7, name: "allowed_permissions", kind: "message", T: ParticipantPermission }
    ]
  );
  var RegisterWorkerResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RegisterWorkerResponse",
    () => [
      {
        no: 1,
        name: "worker_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "server_info", kind: "message", T: ServerInfo }
    ]
  );
  var MigrateJobRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MigrateJobRequest",
    () => [
      { no: 2, name: "job_ids", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var AvailabilityRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AvailabilityRequest",
    () => [
      { no: 1, name: "job", kind: "message", T: Job },
      {
        no: 2,
        name: "resuming",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var AvailabilityResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AvailabilityResponse",
    () => [
      {
        no: 1,
        name: "job_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "available",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 3,
        name: "supports_resume",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 8,
        name: "terminate",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 4,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 7, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } }
    ]
  );
  var UpdateJobStatus = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateJobStatus",
    () => [
      {
        no: 1,
        name: "job_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "status", kind: "enum", T: proto3.getEnumType(JobStatus) },
      {
        no: 3,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var UpdateWorkerStatus = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateWorkerStatus",
    () => [
      { no: 1, name: "status", kind: "enum", T: proto3.getEnumType(WorkerStatus), opt: true },
      {
        no: 3,
        name: "load",
        kind: "scalar",
        T: 2
        /* ScalarType.FLOAT */
      },
      {
        no: 4,
        name: "job_count",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var JobAssignment = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.JobAssignment",
    () => [
      { no: 1, name: "job", kind: "message", T: Job },
      { no: 2, name: "url", kind: "scalar", T: 9, opt: true },
      {
        no: 3,
        name: "token",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var JobTermination = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.JobTermination",
    () => [
      {
        no: 1,
        name: "job_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var CreateAgentDispatchRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateAgentDispatchRequest",
    () => [
      {
        no: 1,
        name: "agent_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var RoomAgentDispatch = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomAgentDispatch",
    () => [
      {
        no: 1,
        name: "agent_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var DeleteAgentDispatchRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteAgentDispatchRequest",
    () => [
      {
        no: 1,
        name: "dispatch_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ListAgentDispatchRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListAgentDispatchRequest",
    () => [
      {
        no: 1,
        name: "dispatch_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ListAgentDispatchResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListAgentDispatchResponse",
    () => [
      { no: 1, name: "agent_dispatches", kind: "message", T: AgentDispatch, repeated: true }
    ]
  );
  var AgentDispatch = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AgentDispatch",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "agent_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "state", kind: "message", T: AgentDispatchState }
    ]
  );
  var AgentDispatchState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AgentDispatchState",
    () => [
      { no: 1, name: "jobs", kind: "message", T: Job, repeated: true },
      {
        no: 2,
        name: "created_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "deleted_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var ConnectorType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ConnectorType",
    [
      { no: 0, name: "Unspecified" },
      { no: 1, name: "WhatsApp" },
      { no: 2, name: "Twilio" }
    ]
  );
  var ConnectTwilioCallRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectTwilioCallRequest",
    () => [
      { no: 1, name: "twilio_call_direction", kind: "enum", T: proto3.getEnumType(ConnectTwilioCallRequest_TwilioCallDirection) },
      {
        no: 2,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "agents", kind: "message", T: RoomAgentDispatch, repeated: true },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 7, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 8,
        name: "destination_country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ConnectTwilioCallRequest_TwilioCallDirection = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ConnectTwilioCallRequest.TwilioCallDirection",
    [
      { no: 0, name: "TWILIO_CALL_DIRECTION_INBOUND", localName: "INBOUND" },
      { no: 1, name: "TWILIO_CALL_DIRECTION_OUTBOUND", localName: "OUTBOUND" }
    ]
  );
  var ConnectTwilioCallResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectTwilioCallResponse",
    () => [
      {
        no: 1,
        name: "connect_url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SignalTarget = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SignalTarget",
    [
      { no: 0, name: "PUBLISHER" },
      { no: 1, name: "SUBSCRIBER" }
    ]
  );
  var StreamState = /* @__PURE__ */ proto3.makeEnum(
    "livekit.StreamState",
    [
      { no: 0, name: "ACTIVE" },
      { no: 1, name: "PAUSED" }
    ]
  );
  var CandidateProtocol = /* @__PURE__ */ proto3.makeEnum(
    "livekit.CandidateProtocol",
    [
      { no: 0, name: "UDP" },
      { no: 1, name: "TCP" },
      { no: 2, name: "TLS" }
    ]
  );
  var SignalRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SignalRequest",
    () => [
      { no: 1, name: "offer", kind: "message", T: SessionDescription, oneof: "message" },
      { no: 2, name: "answer", kind: "message", T: SessionDescription, oneof: "message" },
      { no: 3, name: "trickle", kind: "message", T: TrickleRequest, oneof: "message" },
      { no: 4, name: "add_track", kind: "message", T: AddTrackRequest, oneof: "message" },
      { no: 5, name: "mute", kind: "message", T: MuteTrackRequest, oneof: "message" },
      { no: 6, name: "subscription", kind: "message", T: UpdateSubscription, oneof: "message" },
      { no: 7, name: "track_setting", kind: "message", T: UpdateTrackSettings, oneof: "message" },
      { no: 8, name: "leave", kind: "message", T: LeaveRequest, oneof: "message" },
      { no: 10, name: "update_layers", kind: "message", T: UpdateVideoLayers, oneof: "message" },
      { no: 11, name: "subscription_permission", kind: "message", T: SubscriptionPermission, oneof: "message" },
      { no: 12, name: "sync_state", kind: "message", T: SyncState, oneof: "message" },
      { no: 13, name: "simulate", kind: "message", T: SimulateScenario, oneof: "message" },
      { no: 14, name: "ping", kind: "scalar", T: 3, oneof: "message" },
      { no: 15, name: "update_metadata", kind: "message", T: UpdateParticipantMetadata, oneof: "message" },
      { no: 16, name: "ping_req", kind: "message", T: Ping, oneof: "message" },
      { no: 17, name: "update_audio_track", kind: "message", T: UpdateLocalAudioTrack, oneof: "message" },
      { no: 18, name: "update_video_track", kind: "message", T: UpdateLocalVideoTrack, oneof: "message" },
      { no: 19, name: "publish_data_track_request", kind: "message", T: PublishDataTrackRequest, oneof: "message" },
      { no: 20, name: "unpublish_data_track_request", kind: "message", T: UnpublishDataTrackRequest, oneof: "message" },
      { no: 21, name: "update_data_subscription", kind: "message", T: UpdateDataSubscription, oneof: "message" }
    ]
  );
  var SignalResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SignalResponse",
    () => [
      { no: 1, name: "join", kind: "message", T: JoinResponse, oneof: "message" },
      { no: 2, name: "answer", kind: "message", T: SessionDescription, oneof: "message" },
      { no: 3, name: "offer", kind: "message", T: SessionDescription, oneof: "message" },
      { no: 4, name: "trickle", kind: "message", T: TrickleRequest, oneof: "message" },
      { no: 5, name: "update", kind: "message", T: ParticipantUpdate, oneof: "message" },
      { no: 6, name: "track_published", kind: "message", T: TrackPublishedResponse, oneof: "message" },
      { no: 8, name: "leave", kind: "message", T: LeaveRequest, oneof: "message" },
      { no: 9, name: "mute", kind: "message", T: MuteTrackRequest, oneof: "message" },
      { no: 10, name: "speakers_changed", kind: "message", T: SpeakersChanged, oneof: "message" },
      { no: 11, name: "room_update", kind: "message", T: RoomUpdate, oneof: "message" },
      { no: 12, name: "connection_quality", kind: "message", T: ConnectionQualityUpdate, oneof: "message" },
      { no: 13, name: "stream_state_update", kind: "message", T: StreamStateUpdate, oneof: "message" },
      { no: 14, name: "subscribed_quality_update", kind: "message", T: SubscribedQualityUpdate, oneof: "message" },
      { no: 15, name: "subscription_permission_update", kind: "message", T: SubscriptionPermissionUpdate, oneof: "message" },
      { no: 16, name: "refresh_token", kind: "scalar", T: 9, oneof: "message" },
      { no: 17, name: "track_unpublished", kind: "message", T: TrackUnpublishedResponse, oneof: "message" },
      { no: 18, name: "pong", kind: "scalar", T: 3, oneof: "message" },
      { no: 19, name: "reconnect", kind: "message", T: ReconnectResponse, oneof: "message" },
      { no: 20, name: "pong_resp", kind: "message", T: Pong, oneof: "message" },
      { no: 21, name: "subscription_response", kind: "message", T: SubscriptionResponse, oneof: "message" },
      { no: 22, name: "request_response", kind: "message", T: RequestResponse, oneof: "message" },
      { no: 23, name: "track_subscribed", kind: "message", T: TrackSubscribed, oneof: "message" },
      { no: 24, name: "room_moved", kind: "message", T: RoomMovedResponse, oneof: "message" },
      { no: 25, name: "media_sections_requirement", kind: "message", T: MediaSectionsRequirement, oneof: "message" },
      { no: 26, name: "subscribed_audio_codec_update", kind: "message", T: SubscribedAudioCodecUpdate, oneof: "message" },
      { no: 27, name: "publish_data_track_response", kind: "message", T: PublishDataTrackResponse, oneof: "message" },
      { no: 28, name: "unpublish_data_track_response", kind: "message", T: UnpublishDataTrackResponse, oneof: "message" },
      { no: 29, name: "data_track_subscriber_handles", kind: "message", T: DataTrackSubscriberHandles, oneof: "message" }
    ]
  );
  var SimulcastCodec = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SimulcastCodec",
    () => [
      {
        no: 1,
        name: "codec",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "cid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "layers", kind: "message", T: VideoLayer, repeated: true },
      { no: 5, name: "video_layer_mode", kind: "enum", T: proto3.getEnumType(VideoLayer_Mode) }
    ]
  );
  var AddTrackRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AddTrackRequest",
    () => [
      {
        no: 1,
        name: "cid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
      {
        no: 4,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 6,
        name: "muted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 7,
        name: "disable_dtx",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 8, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
      { no: 9, name: "layers", kind: "message", T: VideoLayer, repeated: true },
      { no: 10, name: "simulcast_codecs", kind: "message", T: SimulcastCodec, repeated: true },
      {
        no: 11,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "stereo",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 13,
        name: "disable_red",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 14, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
      {
        no: 15,
        name: "stream",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 16, name: "backup_codec_policy", kind: "enum", T: proto3.getEnumType(BackupCodecPolicy) },
      { no: 17, name: "audio_features", kind: "enum", T: proto3.getEnumType(AudioTrackFeature), repeated: true },
      { no: 18, name: "packet_trailer_features", kind: "enum", T: proto3.getEnumType(PacketTrailerFeature), repeated: true }
    ]
  );
  var PublishDataTrackRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.PublishDataTrackRequest",
    () => [
      {
        no: 1,
        name: "pub_handle",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) }
    ]
  );
  var PublishDataTrackResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.PublishDataTrackResponse",
    () => [
      { no: 1, name: "info", kind: "message", T: DataTrackInfo }
    ]
  );
  var UnpublishDataTrackRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UnpublishDataTrackRequest",
    () => [
      {
        no: 1,
        name: "pub_handle",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var UnpublishDataTrackResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UnpublishDataTrackResponse",
    () => [
      { no: 1, name: "info", kind: "message", T: DataTrackInfo }
    ]
  );
  var DataTrackSubscriberHandles = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataTrackSubscriberHandles",
    () => [
      { no: 1, name: "sub_handles", kind: "map", K: 13, V: { kind: "message", T: DataTrackSubscriberHandles_PublishedDataTrack } }
    ]
  );
  var DataTrackSubscriberHandles_PublishedDataTrack = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataTrackSubscriberHandles.PublishedDataTrack",
    () => [
      {
        no: 1,
        name: "publisher_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "publisher_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ],
    { localName: "DataTrackSubscriberHandles_PublishedDataTrack" }
  );
  var TrickleRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrickleRequest",
    () => [
      {
        no: 1,
        name: "candidateInit",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "target", kind: "enum", T: proto3.getEnumType(SignalTarget) },
      {
        no: 3,
        name: "final",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var MuteTrackRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MuteTrackRequest",
    () => [
      {
        no: 1,
        name: "sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "muted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var JoinResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.JoinResponse",
    () => [
      { no: 1, name: "room", kind: "message", T: Room },
      { no: 2, name: "participant", kind: "message", T: ParticipantInfo },
      { no: 3, name: "other_participants", kind: "message", T: ParticipantInfo, repeated: true },
      {
        no: 4,
        name: "server_version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "ice_servers", kind: "message", T: ICEServer, repeated: true },
      {
        no: 6,
        name: "subscriber_primary",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 7,
        name: "alternative_url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 8, name: "client_configuration", kind: "message", T: ClientConfiguration },
      {
        no: 9,
        name: "server_region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "ping_timeout",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 11,
        name: "ping_interval",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      { no: 12, name: "server_info", kind: "message", T: ServerInfo },
      {
        no: 13,
        name: "sif_trailer",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      { no: 14, name: "enabled_publish_codecs", kind: "message", T: Codec, repeated: true },
      {
        no: 15,
        name: "fast_publish",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var ReconnectResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ReconnectResponse",
    () => [
      { no: 1, name: "ice_servers", kind: "message", T: ICEServer, repeated: true },
      { no: 2, name: "client_configuration", kind: "message", T: ClientConfiguration },
      { no: 3, name: "server_info", kind: "message", T: ServerInfo },
      {
        no: 4,
        name: "last_message_seq",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var TrackPublishedResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackPublishedResponse",
    () => [
      {
        no: 1,
        name: "cid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "track", kind: "message", T: TrackInfo }
    ]
  );
  var TrackUnpublishedResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackUnpublishedResponse",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SessionDescription = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SessionDescription",
    () => [
      {
        no: 1,
        name: "type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "sdp",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 4, name: "mid_to_track_id", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } }
    ]
  );
  var ParticipantUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ParticipantUpdate",
    () => [
      { no: 1, name: "participants", kind: "message", T: ParticipantInfo, repeated: true }
    ]
  );
  var UpdateSubscription = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSubscription",
    () => [
      { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true },
      {
        no: 2,
        name: "subscribe",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "participant_tracks", kind: "message", T: ParticipantTracks, repeated: true }
    ]
  );
  var UpdateDataSubscription = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateDataSubscription",
    () => [
      { no: 1, name: "updates", kind: "message", T: UpdateDataSubscription_Update, repeated: true }
    ]
  );
  var UpdateDataSubscription_Update = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateDataSubscription.Update",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "subscribe",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "options", kind: "message", T: DataTrackSubscriptionOptions }
    ],
    { localName: "UpdateDataSubscription_Update" }
  );
  var UpdateTrackSettings = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateTrackSettings",
    () => [
      { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true },
      {
        no: 3,
        name: "disabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 4, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
      {
        no: 5,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 6,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 7,
        name: "fps",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 8,
        name: "priority",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var UpdateLocalAudioTrack = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateLocalAudioTrack",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "features", kind: "enum", T: proto3.getEnumType(AudioTrackFeature), repeated: true }
    ]
  );
  var UpdateLocalVideoTrack = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateLocalVideoTrack",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var LeaveRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.LeaveRequest",
    () => [
      {
        no: 1,
        name: "can_reconnect",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 2, name: "reason", kind: "enum", T: proto3.getEnumType(DisconnectReason) },
      { no: 3, name: "action", kind: "enum", T: proto3.getEnumType(LeaveRequest_Action) },
      { no: 4, name: "regions", kind: "message", T: RegionSettings }
    ]
  );
  var LeaveRequest_Action = /* @__PURE__ */ proto3.makeEnum(
    "livekit.LeaveRequest.Action",
    [
      { no: 0, name: "DISCONNECT" },
      { no: 1, name: "RESUME" },
      { no: 2, name: "RECONNECT" }
    ]
  );
  var UpdateVideoLayers = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateVideoLayers",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "layers", kind: "message", T: VideoLayer, repeated: true }
    ]
  );
  var UpdateParticipantMetadata = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateParticipantMetadata",
    () => [
      {
        no: 1,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 4,
        name: "request_id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var ICEServer = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ICEServer",
    () => [
      { no: 1, name: "urls", kind: "scalar", T: 9, repeated: true },
      {
        no: 2,
        name: "username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "credential",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SpeakersChanged = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SpeakersChanged",
    () => [
      { no: 1, name: "speakers", kind: "message", T: SpeakerInfo, repeated: true }
    ]
  );
  var RoomUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomUpdate",
    () => [
      { no: 1, name: "room", kind: "message", T: Room }
    ]
  );
  var ConnectionQualityInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectionQualityInfo",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "quality", kind: "enum", T: proto3.getEnumType(ConnectionQuality) },
      {
        no: 3,
        name: "score",
        kind: "scalar",
        T: 2
        /* ScalarType.FLOAT */
      }
    ]
  );
  var ConnectionQualityUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectionQualityUpdate",
    () => [
      { no: 1, name: "updates", kind: "message", T: ConnectionQualityInfo, repeated: true }
    ]
  );
  var StreamStateInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StreamStateInfo",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "state", kind: "enum", T: proto3.getEnumType(StreamState) }
    ]
  );
  var StreamStateUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StreamStateUpdate",
    () => [
      { no: 1, name: "stream_states", kind: "message", T: StreamStateInfo, repeated: true }
    ]
  );
  var SubscribedQuality = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscribedQuality",
    () => [
      { no: 1, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
      {
        no: 2,
        name: "enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var SubscribedCodec = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscribedCodec",
    () => [
      {
        no: 1,
        name: "codec",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "qualities", kind: "message", T: SubscribedQuality, repeated: true }
    ]
  );
  var SubscribedQualityUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscribedQualityUpdate",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "subscribed_qualities", kind: "message", T: SubscribedQuality, repeated: true },
      { no: 3, name: "subscribed_codecs", kind: "message", T: SubscribedCodec, repeated: true }
    ]
  );
  var SubscribedAudioCodecUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscribedAudioCodecUpdate",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "subscribed_audio_codecs", kind: "message", T: SubscribedAudioCodec, repeated: true }
    ]
  );
  var TrackPermission = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackPermission",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "all_tracks",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "track_sids", kind: "scalar", T: 9, repeated: true },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SubscriptionPermission = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscriptionPermission",
    () => [
      {
        no: 1,
        name: "all_participants",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 2, name: "track_permissions", kind: "message", T: TrackPermission, repeated: true }
    ]
  );
  var SubscriptionPermissionUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscriptionPermissionUpdate",
    () => [
      {
        no: 1,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "allowed",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var RoomMovedResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomMovedResponse",
    () => [
      { no: 1, name: "room", kind: "message", T: Room },
      {
        no: 2,
        name: "token",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "participant", kind: "message", T: ParticipantInfo },
      { no: 4, name: "other_participants", kind: "message", T: ParticipantInfo, repeated: true }
    ]
  );
  var SyncState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SyncState",
    () => [
      { no: 1, name: "answer", kind: "message", T: SessionDescription },
      { no: 2, name: "subscription", kind: "message", T: UpdateSubscription },
      { no: 3, name: "publish_tracks", kind: "message", T: TrackPublishedResponse, repeated: true },
      { no: 4, name: "data_channels", kind: "message", T: DataChannelInfo, repeated: true },
      { no: 5, name: "offer", kind: "message", T: SessionDescription },
      { no: 6, name: "track_sids_disabled", kind: "scalar", T: 9, repeated: true },
      { no: 7, name: "datachannel_receive_states", kind: "message", T: DataChannelReceiveState, repeated: true },
      { no: 8, name: "publish_data_tracks", kind: "message", T: PublishDataTrackResponse, repeated: true }
    ]
  );
  var DataChannelReceiveState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataChannelReceiveState",
    () => [
      {
        no: 1,
        name: "publisher_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "last_seq",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var DataChannelInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DataChannelInfo",
    () => [
      {
        no: 1,
        name: "label",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 3, name: "target", kind: "enum", T: proto3.getEnumType(SignalTarget) }
    ]
  );
  var SimulateScenario = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SimulateScenario",
    () => [
      { no: 1, name: "speaker_update", kind: "scalar", T: 5, oneof: "scenario" },
      { no: 2, name: "node_failure", kind: "scalar", T: 8, oneof: "scenario" },
      { no: 3, name: "migration", kind: "scalar", T: 8, oneof: "scenario" },
      { no: 4, name: "server_leave", kind: "scalar", T: 8, oneof: "scenario" },
      { no: 5, name: "switch_candidate_protocol", kind: "enum", T: proto3.getEnumType(CandidateProtocol), oneof: "scenario" },
      { no: 6, name: "subscriber_bandwidth", kind: "scalar", T: 3, oneof: "scenario" },
      { no: 7, name: "disconnect_signal_on_resume", kind: "scalar", T: 8, oneof: "scenario" },
      { no: 8, name: "disconnect_signal_on_resume_no_messages", kind: "scalar", T: 8, oneof: "scenario" },
      { no: 9, name: "leave_request_full_reconnect", kind: "scalar", T: 8, oneof: "scenario" }
    ]
  );
  var Ping = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Ping",
    () => [
      {
        no: 1,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 2,
        name: "rtt",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var Pong = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Pong",
    () => [
      {
        no: 1,
        name: "last_ping_timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var RegionSettings = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RegionSettings",
    () => [
      { no: 1, name: "regions", kind: "message", T: RegionInfo, repeated: true }
    ]
  );
  var RegionInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RegionInfo",
    () => [
      {
        no: 1,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "distance",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var SubscriptionResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SubscriptionResponse",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "err", kind: "enum", T: proto3.getEnumType(SubscriptionError) }
    ]
  );
  var RequestResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RequestResponse",
    () => [
      {
        no: 1,
        name: "request_id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 2, name: "reason", kind: "enum", T: proto3.getEnumType(RequestResponse_Reason) },
      {
        no: 3,
        name: "message",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "trickle", kind: "message", T: TrickleRequest, oneof: "request" },
      { no: 5, name: "add_track", kind: "message", T: AddTrackRequest, oneof: "request" },
      { no: 6, name: "mute", kind: "message", T: MuteTrackRequest, oneof: "request" },
      { no: 7, name: "update_metadata", kind: "message", T: UpdateParticipantMetadata, oneof: "request" },
      { no: 8, name: "update_audio_track", kind: "message", T: UpdateLocalAudioTrack, oneof: "request" },
      { no: 9, name: "update_video_track", kind: "message", T: UpdateLocalVideoTrack, oneof: "request" },
      { no: 10, name: "publish_data_track", kind: "message", T: PublishDataTrackRequest, oneof: "request" },
      { no: 11, name: "unpublish_data_track", kind: "message", T: UnpublishDataTrackRequest, oneof: "request" }
    ]
  );
  var RequestResponse_Reason = /* @__PURE__ */ proto3.makeEnum(
    "livekit.RequestResponse.Reason",
    [
      { no: 0, name: "OK" },
      { no: 1, name: "NOT_FOUND" },
      { no: 2, name: "NOT_ALLOWED" },
      { no: 3, name: "LIMIT_EXCEEDED" },
      { no: 4, name: "QUEUED" },
      { no: 5, name: "UNSUPPORTED_TYPE" },
      { no: 6, name: "UNCLASSIFIED_ERROR" },
      { no: 7, name: "INVALID_HANDLE" },
      { no: 8, name: "INVALID_NAME" },
      { no: 9, name: "DUPLICATE_HANDLE" },
      { no: 10, name: "DUPLICATE_NAME" }
    ]
  );
  var TrackSubscribed = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackSubscribed",
    () => [
      {
        no: 1,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ConnectionSettings = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectionSettings",
    () => [
      {
        no: 1,
        name: "auto_subscribe",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 2,
        name: "adaptive_stream",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "subscriber_allow_pause", kind: "scalar", T: 8, opt: true },
      {
        no: 4,
        name: "disable_ice_lite",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 5, name: "auto_subscribe_data_track", kind: "scalar", T: 8, opt: true }
    ]
  );
  var JoinRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.JoinRequest",
    () => [
      { no: 1, name: "client_info", kind: "message", T: ClientInfo },
      { no: 2, name: "connection_settings", kind: "message", T: ConnectionSettings },
      {
        no: 3,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 5, name: "add_track_requests", kind: "message", T: AddTrackRequest, repeated: true },
      { no: 6, name: "publisher_offer", kind: "message", T: SessionDescription },
      {
        no: 7,
        name: "reconnect",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 8, name: "reconnect_reason", kind: "enum", T: proto3.getEnumType(ReconnectReason) },
      {
        no: 9,
        name: "participant_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 10, name: "sync_state", kind: "message", T: SyncState }
    ]
  );
  var WrappedJoinRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WrappedJoinRequest",
    () => [
      { no: 1, name: "compression", kind: "enum", T: proto3.getEnumType(WrappedJoinRequest_Compression) },
      {
        no: 2,
        name: "join_request",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]
  );
  var WrappedJoinRequest_Compression = /* @__PURE__ */ proto3.makeEnum(
    "livekit.WrappedJoinRequest.Compression",
    [
      { no: 0, name: "NONE" },
      { no: 1, name: "GZIP" }
    ]
  );
  var MediaSectionsRequirement = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MediaSectionsRequirement",
    () => [
      {
        no: 1,
        name: "num_audios",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "num_videos",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var WhatsAppCallDirection = /* @__PURE__ */ proto3.makeEnum(
    "livekit.WhatsAppCallDirection",
    [
      { no: 0, name: "WHATSAPP_CALL_DIRECTION_INBOUND" },
      { no: 2, name: "WHATSAPP_CALL_DIRECTION_OUTBOUND" }
    ]
  );
  var DialWhatsAppCallRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DialWhatsAppCallRequest",
    () => [
      {
        no: 1,
        name: "whatsapp_phone_number_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "whatsapp_to_phone_number",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "whatsapp_api_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "whatsapp_cloud_api_version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "whatsapp_biz_opaque_callback_data",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "agents", kind: "message", T: RoomAgentDispatch, repeated: true },
      {
        no: 7,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 10, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 11,
        name: "destination_country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 13, name: "ringing_timeout", kind: "message", T: Duration }
    ]
  );
  var DialWhatsAppCallResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DialWhatsAppCallResponse",
    () => [
      {
        no: 1,
        name: "whatsapp_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var DisconnectWhatsAppCallRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DisconnectWhatsAppCallRequest",
    () => [
      {
        no: 1,
        name: "whatsapp_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "whatsapp_api_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "disconnect_reason", kind: "enum", T: proto3.getEnumType(DisconnectWhatsAppCallRequest_DisconnectReason) }
    ]
  );
  var DisconnectWhatsAppCallRequest_DisconnectReason = /* @__PURE__ */ proto3.makeEnum(
    "livekit.DisconnectWhatsAppCallRequest.DisconnectReason",
    [
      { no: 0, name: "BUSINESS_INITIATED" },
      { no: 1, name: "USER_INITIATED" }
    ]
  );
  var DisconnectWhatsAppCallResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DisconnectWhatsAppCallResponse",
    []
  );
  var ConnectWhatsAppCallRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectWhatsAppCallRequest",
    () => [
      {
        no: 1,
        name: "whatsapp_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "sdp", kind: "message", T: SessionDescription }
    ]
  );
  var ConnectWhatsAppCallResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ConnectWhatsAppCallResponse",
    []
  );
  var AcceptWhatsAppCallRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AcceptWhatsAppCallRequest",
    () => [
      {
        no: 1,
        name: "whatsapp_phone_number_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "whatsapp_api_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 13,
        name: "whatsapp_cloud_api_version",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "whatsapp_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "whatsapp_biz_opaque_callback_data",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "sdp", kind: "message", T: SessionDescription },
      {
        no: 6,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 7, name: "agents", kind: "message", T: RoomAgentDispatch, repeated: true },
      {
        no: 8,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 11, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 12,
        name: "destination_country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 14, name: "ringing_timeout", kind: "message", T: Duration },
      {
        no: 15,
        name: "wait_until_answered",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var AcceptWhatsAppCallResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AcceptWhatsAppCallResponse",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var WhatsAppCall = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WhatsAppCall",
    () => [
      {
        no: 1,
        name: "whatsapp_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "direction", kind: "enum", T: proto3.getEnumType(WhatsAppCallDirection) }
    ]
  );
  var EncodedFileType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.EncodedFileType",
    [
      { no: 0, name: "DEFAULT_FILETYPE" },
      { no: 1, name: "MP4" },
      { no: 2, name: "OGG" },
      { no: 3, name: "MP3" }
    ]
  );
  var SegmentedFileProtocol = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SegmentedFileProtocol",
    [
      { no: 0, name: "DEFAULT_SEGMENTED_FILE_PROTOCOL" },
      { no: 1, name: "HLS_PROTOCOL" }
    ]
  );
  var SegmentedFileSuffix = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SegmentedFileSuffix",
    [
      { no: 0, name: "INDEX" },
      { no: 1, name: "TIMESTAMP" }
    ]
  );
  var ImageFileSuffix = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ImageFileSuffix",
    [
      { no: 0, name: "IMAGE_SUFFIX_INDEX" },
      { no: 1, name: "IMAGE_SUFFIX_TIMESTAMP" },
      { no: 2, name: "IMAGE_SUFFIX_NONE_OVERWRITE" }
    ]
  );
  var StreamProtocol = /* @__PURE__ */ proto3.makeEnum(
    "livekit.StreamProtocol",
    [
      { no: 0, name: "DEFAULT_PROTOCOL" },
      { no: 1, name: "RTMP" },
      { no: 2, name: "SRT" }
    ]
  );
  var AudioMixing = /* @__PURE__ */ proto3.makeEnum(
    "livekit.AudioMixing",
    [
      { no: 0, name: "DEFAULT_MIXING" },
      { no: 1, name: "DUAL_CHANNEL_AGENT" },
      { no: 2, name: "DUAL_CHANNEL_ALTERNATE" }
    ]
  );
  var EncodingOptionsPreset = /* @__PURE__ */ proto3.makeEnum(
    "livekit.EncodingOptionsPreset",
    [
      { no: 0, name: "H264_720P_30" },
      { no: 1, name: "H264_720P_60" },
      { no: 2, name: "H264_1080P_30" },
      { no: 3, name: "H264_1080P_60" },
      { no: 4, name: "PORTRAIT_H264_720P_30" },
      { no: 5, name: "PORTRAIT_H264_720P_60" },
      { no: 6, name: "PORTRAIT_H264_1080P_30" },
      { no: 7, name: "PORTRAIT_H264_1080P_60" }
    ]
  );
  var EgressStatus = /* @__PURE__ */ proto3.makeEnum(
    "livekit.EgressStatus",
    [
      { no: 0, name: "EGRESS_STARTING" },
      { no: 1, name: "EGRESS_ACTIVE" },
      { no: 2, name: "EGRESS_ENDING" },
      { no: 3, name: "EGRESS_COMPLETE" },
      { no: 4, name: "EGRESS_FAILED" },
      { no: 5, name: "EGRESS_ABORTED" },
      { no: 6, name: "EGRESS_LIMIT_REACHED" }
    ]
  );
  var EgressSourceType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.EgressSourceType",
    [
      { no: 0, name: "EGRESS_SOURCE_TYPE_WEB", localName: "WEB" },
      { no: 1, name: "EGRESS_SOURCE_TYPE_SDK", localName: "SDK" }
    ]
  );
  var RoomCompositeEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomCompositeEgressRequest",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "layout",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "audio_only",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 15, name: "audio_mixing", kind: "enum", T: proto3.getEnumType(AudioMixing) },
      {
        no: 4,
        name: "video_only",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 5,
        name: "custom_base_url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
      { no: 7, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
      { no: 10, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
      { no: 8, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
      { no: 9, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
      { no: 11, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
      { no: 12, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
      { no: 13, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
      { no: 14, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true },
      { no: 16, name: "webhooks", kind: "message", T: WebhookConfig, repeated: true }
    ]
  );
  var WebEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WebEgressRequest",
    () => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "audio_only",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 3,
        name: "video_only",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 12,
        name: "await_start_signal",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 4, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
      { no: 5, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
      { no: 6, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
      { no: 7, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
      { no: 8, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
      { no: 9, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
      { no: 10, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
      { no: 11, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
      { no: 13, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true },
      { no: 14, name: "webhooks", kind: "message", T: WebhookConfig, repeated: true }
    ]
  );
  var ParticipantEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ParticipantEgressRequest",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "screen_share",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 4, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
      { no: 5, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
      { no: 6, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
      { no: 7, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
      { no: 8, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
      { no: 9, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true },
      { no: 10, name: "webhooks", kind: "message", T: WebhookConfig, repeated: true }
    ]
  );
  var TrackCompositeEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackCompositeEgressRequest",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "audio_track_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "video_track_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
      { no: 5, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
      { no: 8, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
      { no: 6, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
      { no: 7, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
      { no: 11, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
      { no: 12, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
      { no: 13, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
      { no: 14, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true },
      { no: 15, name: "webhooks", kind: "message", T: WebhookConfig, repeated: true }
    ]
  );
  var TrackEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TrackEgressRequest",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "track_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "file", kind: "message", T: DirectFileOutput, oneof: "output" },
      { no: 4, name: "websocket_url", kind: "scalar", T: 9, oneof: "output" },
      { no: 5, name: "webhooks", kind: "message", T: WebhookConfig, repeated: true }
    ]
  );
  var EncodedFileOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EncodedFileOutput",
    () => [
      { no: 1, name: "file_type", kind: "enum", T: proto3.getEnumType(EncodedFileType) },
      {
        no: 2,
        name: "filepath",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "disable_manifest",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 3, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
      { no: 4, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
      { no: 5, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
      { no: 7, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
    ]
  );
  var SegmentedFileOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SegmentedFileOutput",
    () => [
      { no: 1, name: "protocol", kind: "enum", T: proto3.getEnumType(SegmentedFileProtocol) },
      {
        no: 2,
        name: "filename_prefix",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "playlist_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "live_playlist_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "segment_duration",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 10, name: "filename_suffix", kind: "enum", T: proto3.getEnumType(SegmentedFileSuffix) },
      {
        no: 8,
        name: "disable_manifest",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 5, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
      { no: 6, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
      { no: 7, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
      { no: 9, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
    ]
  );
  var DirectFileOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DirectFileOutput",
    () => [
      {
        no: 1,
        name: "filepath",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "disable_manifest",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 2, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
      { no: 3, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
      { no: 4, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
      { no: 6, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
    ]
  );
  var ImageOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ImageOutput",
    () => [
      {
        no: 1,
        name: "capture_interval",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "width",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 3,
        name: "height",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "filename_prefix",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "filename_suffix", kind: "enum", T: proto3.getEnumType(ImageFileSuffix) },
      { no: 6, name: "image_codec", kind: "enum", T: proto3.getEnumType(ImageCodec) },
      {
        no: 7,
        name: "disable_manifest",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 8, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
      { no: 9, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
      { no: 10, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
      { no: 11, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
    ]
  );
  var S3Upload = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.S3Upload",
    () => [
      {
        no: 1,
        name: "access_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "secret",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "session_token",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "assume_role_arn",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 13,
        name: "assume_role_external_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "endpoint",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "bucket",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "force_path_style",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 7, name: "metadata", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 8,
        name: "tagging",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "content_disposition",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 10, name: "proxy", kind: "message", T: ProxyConfig }
    ]
  );
  var GCPUpload = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.GCPUpload",
    () => [
      {
        no: 1,
        name: "credentials",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "bucket",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "proxy", kind: "message", T: ProxyConfig }
    ]
  );
  var AzureBlobUpload = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AzureBlobUpload",
    () => [
      {
        no: 1,
        name: "account_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "account_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "container_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var AliOSSUpload = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AliOSSUpload",
    () => [
      {
        no: 1,
        name: "access_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "secret",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "endpoint",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "bucket",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ProxyConfig = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ProxyConfig",
    () => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var StreamOutput = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StreamOutput",
    () => [
      { no: 1, name: "protocol", kind: "enum", T: proto3.getEnumType(StreamProtocol) },
      { no: 2, name: "urls", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var EncodingOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EncodingOptions",
    () => [
      {
        no: 1,
        name: "width",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 2,
        name: "height",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 3,
        name: "depth",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "framerate",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      { no: 5, name: "audio_codec", kind: "enum", T: proto3.getEnumType(AudioCodec) },
      {
        no: 6,
        name: "audio_bitrate",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 11,
        name: "audio_quality",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 7,
        name: "audio_frequency",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      { no: 8, name: "video_codec", kind: "enum", T: proto3.getEnumType(VideoCodec) },
      {
        no: 9,
        name: "video_bitrate",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 12,
        name: "video_quality",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 10,
        name: "key_frame_interval",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var UpdateLayoutRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateLayoutRequest",
    () => [
      {
        no: 1,
        name: "egress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "layout",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var UpdateStreamRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateStreamRequest",
    () => [
      {
        no: 1,
        name: "egress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "add_output_urls", kind: "scalar", T: 9, repeated: true },
      { no: 3, name: "remove_output_urls", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ListEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListEgressRequest",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "egress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "active",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var ListEgressResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListEgressResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: EgressInfo, repeated: true }
    ]
  );
  var StopEgressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StopEgressRequest",
    () => [
      {
        no: 1,
        name: "egress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var EgressInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.EgressInfo",
    () => [
      {
        no: 1,
        name: "egress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 13,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 26, name: "source_type", kind: "enum", T: proto3.getEnumType(EgressSourceType) },
      { no: 3, name: "status", kind: "enum", T: proto3.getEnumType(EgressStatus) },
      {
        no: 10,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 11,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 18,
        name: "updated_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 21,
        name: "details",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 22,
        name: "error_code",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      { no: 4, name: "room_composite", kind: "message", T: RoomCompositeEgressRequest, oneof: "request" },
      { no: 14, name: "web", kind: "message", T: WebEgressRequest, oneof: "request" },
      { no: 19, name: "participant", kind: "message", T: ParticipantEgressRequest, oneof: "request" },
      { no: 5, name: "track_composite", kind: "message", T: TrackCompositeEgressRequest, oneof: "request" },
      { no: 6, name: "track", kind: "message", T: TrackEgressRequest, oneof: "request" },
      { no: 7, name: "stream", kind: "message", T: StreamInfoList, oneof: "result" },
      { no: 8, name: "file", kind: "message", T: FileInfo, oneof: "result" },
      { no: 12, name: "segments", kind: "message", T: SegmentsInfo, oneof: "result" },
      { no: 15, name: "stream_results", kind: "message", T: StreamInfo, repeated: true },
      { no: 16, name: "file_results", kind: "message", T: FileInfo, repeated: true },
      { no: 17, name: "segment_results", kind: "message", T: SegmentsInfo, repeated: true },
      { no: 20, name: "image_results", kind: "message", T: ImagesInfo, repeated: true },
      {
        no: 23,
        name: "manifest_location",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 25,
        name: "backup_storage_used",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 27,
        name: "retry_count",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var StreamInfoList = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StreamInfoList",
    () => [
      { no: 1, name: "info", kind: "message", T: StreamInfo, repeated: true }
    ]
  );
  var StreamInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.StreamInfo",
    () => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 4,
        name: "duration",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 5, name: "status", kind: "enum", T: proto3.getEnumType(StreamInfo_Status) },
      {
        no: 6,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "last_retry_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 8,
        name: "retries",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var StreamInfo_Status = /* @__PURE__ */ proto3.makeEnum(
    "livekit.StreamInfo.Status",
    [
      { no: 0, name: "ACTIVE" },
      { no: 1, name: "FINISHED" },
      { no: 2, name: "FAILED" }
    ]
  );
  var FileInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.FileInfo",
    () => [
      {
        no: 1,
        name: "filename",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "duration",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 4,
        name: "size",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 5,
        name: "location",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SegmentsInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SegmentsInfo",
    () => [
      {
        no: 1,
        name: "playlist_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "live_playlist_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "duration",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "size",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 4,
        name: "playlist_location",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "live_playlist_location",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "segment_count",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 7,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var ImagesInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ImagesInfo",
    () => [
      {
        no: 4,
        name: "filename_prefix",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 1,
        name: "image_count",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 2,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 3,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      }
    ]
  );
  var AutoParticipantEgress = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AutoParticipantEgress",
    () => [
      { no: 1, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
      { no: 2, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
      { no: 3, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
      { no: 4, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true }
    ]
  );
  var AutoTrackEgress = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.AutoTrackEgress",
    () => [
      {
        no: 1,
        name: "filepath",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "disable_manifest",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 2, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
      { no: 3, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
      { no: 4, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
      { no: 6, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
    ]
  );
  var IngressInput = /* @__PURE__ */ proto3.makeEnum(
    "livekit.IngressInput",
    [
      { no: 0, name: "RTMP_INPUT" },
      { no: 1, name: "WHIP_INPUT" },
      { no: 2, name: "URL_INPUT" }
    ]
  );
  var IngressAudioEncodingPreset = /* @__PURE__ */ proto3.makeEnum(
    "livekit.IngressAudioEncodingPreset",
    [
      { no: 0, name: "OPUS_STEREO_96KBPS" },
      { no: 1, name: "OPUS_MONO_64KBS" }
    ]
  );
  var IngressVideoEncodingPreset = /* @__PURE__ */ proto3.makeEnum(
    "livekit.IngressVideoEncodingPreset",
    [
      { no: 0, name: "H264_720P_30FPS_3_LAYERS" },
      { no: 1, name: "H264_1080P_30FPS_3_LAYERS" },
      { no: 2, name: "H264_540P_25FPS_2_LAYERS" },
      { no: 3, name: "H264_720P_30FPS_1_LAYER" },
      { no: 4, name: "H264_1080P_30FPS_1_LAYER" },
      { no: 5, name: "H264_720P_30FPS_3_LAYERS_HIGH_MOTION" },
      { no: 6, name: "H264_1080P_30FPS_3_LAYERS_HIGH_MOTION" },
      { no: 7, name: "H264_540P_25FPS_2_LAYERS_HIGH_MOTION" },
      { no: 8, name: "H264_720P_30FPS_1_LAYER_HIGH_MOTION" },
      { no: 9, name: "H264_1080P_30FPS_1_LAYER_HIGH_MOTION" }
    ]
  );
  var CreateIngressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateIngressRequest",
    () => [
      { no: 1, name: "input_type", kind: "enum", T: proto3.getEnumType(IngressInput) },
      {
        no: 9,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "bypass_transcoding",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 11, name: "enable_transcoding", kind: "scalar", T: 8, opt: true },
      { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
      { no: 7, name: "video", kind: "message", T: IngressVideoOptions },
      { no: 12, name: "enabled", kind: "scalar", T: 8, opt: true }
    ]
  );
  var IngressAudioOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressAudioOptions",
    () => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
      { no: 3, name: "preset", kind: "enum", T: proto3.getEnumType(IngressAudioEncodingPreset), oneof: "encoding_options" },
      { no: 4, name: "options", kind: "message", T: IngressAudioEncodingOptions, oneof: "encoding_options" }
    ]
  );
  var IngressVideoOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressVideoOptions",
    () => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
      { no: 3, name: "preset", kind: "enum", T: proto3.getEnumType(IngressVideoEncodingPreset), oneof: "encoding_options" },
      { no: 4, name: "options", kind: "message", T: IngressVideoEncodingOptions, oneof: "encoding_options" }
    ]
  );
  var IngressAudioEncodingOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressAudioEncodingOptions",
    () => [
      { no: 1, name: "audio_codec", kind: "enum", T: proto3.getEnumType(AudioCodec) },
      {
        no: 2,
        name: "bitrate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "disable_dtx",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 4,
        name: "channels",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var IngressVideoEncodingOptions = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressVideoEncodingOptions",
    () => [
      { no: 1, name: "video_codec", kind: "enum", T: proto3.getEnumType(VideoCodec) },
      {
        no: 2,
        name: "frame_rate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      { no: 3, name: "layers", kind: "message", T: VideoLayer, repeated: true }
    ]
  );
  var IngressInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressInfo",
    () => [
      {
        no: 1,
        name: "ingress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "stream_key",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "input_type", kind: "enum", T: proto3.getEnumType(IngressInput) },
      {
        no: 13,
        name: "bypass_transcoding",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 15, name: "enable_transcoding", kind: "scalar", T: 8, opt: true },
      { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
      { no: 7, name: "video", kind: "message", T: IngressVideoOptions },
      {
        no: 8,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 14,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "reusable",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 12, name: "state", kind: "message", T: IngressState },
      { no: 16, name: "enabled", kind: "scalar", T: 8, opt: true }
    ]
  );
  var IngressState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.IngressState",
    () => [
      { no: 1, name: "status", kind: "enum", T: proto3.getEnumType(IngressState_Status) },
      {
        no: 2,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "video", kind: "message", T: InputVideoState },
      { no: 4, name: "audio", kind: "message", T: InputAudioState },
      {
        no: 5,
        name: "room_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 8,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 10,
        name: "updated_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 9,
        name: "resource_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "tracks", kind: "message", T: TrackInfo, repeated: true }
    ]
  );
  var IngressState_Status = /* @__PURE__ */ proto3.makeEnum(
    "livekit.IngressState.Status",
    [
      { no: 0, name: "ENDPOINT_INACTIVE" },
      { no: 1, name: "ENDPOINT_BUFFERING" },
      { no: 2, name: "ENDPOINT_PUBLISHING" },
      { no: 3, name: "ENDPOINT_ERROR" },
      { no: 4, name: "ENDPOINT_COMPLETE" }
    ]
  );
  var InputVideoState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.InputVideoState",
    () => [
      {
        no: 1,
        name: "mime_type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "average_bitrate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "width",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "height",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 5,
        name: "framerate",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      }
    ]
  );
  var InputAudioState = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.InputAudioState",
    () => [
      {
        no: 1,
        name: "mime_type",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "average_bitrate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "channels",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "sample_rate",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var UpdateIngressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateIngressRequest",
    () => [
      {
        no: 1,
        name: "ingress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 8, name: "bypass_transcoding", kind: "scalar", T: 8, opt: true },
      { no: 10, name: "enable_transcoding", kind: "scalar", T: 8, opt: true },
      { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
      { no: 7, name: "video", kind: "message", T: IngressVideoOptions },
      { no: 11, name: "enabled", kind: "scalar", T: 8, opt: true }
    ]
  );
  var ListIngressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListIngressRequest",
    () => [
      { no: 3, name: "page_token", kind: "message", T: TokenPagination },
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "ingress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ListIngressResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListIngressResponse",
    () => [
      { no: 2, name: "next_page_token", kind: "message", T: TokenPagination },
      { no: 1, name: "items", kind: "message", T: IngressInfo, repeated: true }
    ]
  );
  var DeleteIngressRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteIngressRequest",
    () => [
      {
        no: 1,
        name: "ingress_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var CreateRoomRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateRoomRequest",
    () => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "room_preset",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "empty_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 10,
        name: "departure_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "max_participants",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "node_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "egress", kind: "message", T: RoomEgress },
      {
        no: 7,
        name: "min_playout_delay",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 8,
        name: "max_playout_delay",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 9,
        name: "sync_streams",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 13,
        name: "replay_enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 14, name: "agents", kind: "message", T: RoomAgentDispatch, repeated: true }
    ]
  );
  var RoomEgress = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomEgress",
    () => [
      { no: 1, name: "room", kind: "message", T: RoomCompositeEgressRequest },
      { no: 3, name: "participant", kind: "message", T: AutoParticipantEgress },
      { no: 2, name: "tracks", kind: "message", T: AutoTrackEgress }
    ]
  );
  var RoomAgent = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomAgent",
    () => [
      { no: 1, name: "dispatches", kind: "message", T: RoomAgentDispatch, repeated: true }
    ]
  );
  var ListRoomsRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListRoomsRequest",
    () => [
      { no: 1, name: "names", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ListRoomsResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListRoomsResponse",
    () => [
      { no: 1, name: "rooms", kind: "message", T: Room, repeated: true }
    ]
  );
  var DeleteRoomRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteRoomRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var DeleteRoomResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteRoomResponse",
    []
  );
  var ListParticipantsRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListParticipantsRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ListParticipantsResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListParticipantsResponse",
    () => [
      { no: 1, name: "participants", kind: "message", T: ParticipantInfo, repeated: true }
    ]
  );
  var RoomParticipantIdentity = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomParticipantIdentity",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var RemoveParticipantResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RemoveParticipantResponse",
    []
  );
  var MuteRoomTrackRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MuteRoomTrackRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "track_sid",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "muted",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var MuteRoomTrackResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MuteRoomTrackResponse",
    () => [
      { no: 1, name: "track", kind: "message", T: TrackInfo }
    ]
  );
  var UpdateParticipantRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateParticipantRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "permission", kind: "message", T: ParticipantPermission },
      {
        no: 5,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } }
    ]
  );
  var UpdateSubscriptionsRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSubscriptionsRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "track_sids", kind: "scalar", T: 9, repeated: true },
      {
        no: 4,
        name: "subscribe",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 5, name: "participant_tracks", kind: "message", T: ParticipantTracks, repeated: true }
    ]
  );
  var UpdateSubscriptionsResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSubscriptionsResponse",
    []
  );
  var SendDataRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SendDataRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "data",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      },
      { no: 3, name: "kind", kind: "enum", T: proto3.getEnumType(DataPacket_Kind) },
      { no: 4, name: "destination_sids", kind: "scalar", T: 9, repeated: true },
      { no: 6, name: "destination_identities", kind: "scalar", T: 9, repeated: true },
      { no: 5, name: "topic", kind: "scalar", T: 9, opt: true },
      {
        no: 7,
        name: "nonce",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]
  );
  var SendDataResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SendDataResponse",
    []
  );
  var UpdateRoomMetadataRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateRoomMetadataRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var RoomConfiguration = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.RoomConfiguration",
    () => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "empty_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "departure_timeout",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 4,
        name: "max_participants",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 11,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "egress", kind: "message", T: RoomEgress },
      {
        no: 7,
        name: "min_playout_delay",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 8,
        name: "max_playout_delay",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 9,
        name: "sync_streams",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 10, name: "agents", kind: "message", T: RoomAgentDispatch, repeated: true }
    ]
  );
  var ForwardParticipantRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ForwardParticipantRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "destination_room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ForwardParticipantResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ForwardParticipantResponse",
    []
  );
  var MoveParticipantRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MoveParticipantRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "destination_room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var MoveParticipantResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.MoveParticipantResponse",
    []
  );
  var PerformRpcRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.PerformRpcRequest",
    () => [
      {
        no: 1,
        name: "room",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "destination_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "method",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "payload",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "response_timeout_ms",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]
  );
  var PerformRpcResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.PerformRpcResponse",
    () => [
      {
        no: 1,
        name: "payload",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPStatusCode = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPStatusCode",
    [
      { no: 0, name: "SIP_STATUS_UNKNOWN" },
      { no: 100, name: "SIP_STATUS_TRYING" },
      { no: 180, name: "SIP_STATUS_RINGING" },
      { no: 181, name: "SIP_STATUS_CALL_IS_FORWARDED" },
      { no: 182, name: "SIP_STATUS_QUEUED" },
      { no: 183, name: "SIP_STATUS_SESSION_PROGRESS" },
      { no: 199, name: "SIP_STATUS_EARLY_DIALOG_TERMINATED" },
      { no: 200, name: "SIP_STATUS_OK" },
      { no: 202, name: "SIP_STATUS_ACCEPTED" },
      { no: 204, name: "SIP_STATUS_NO_NOTIFICATION" },
      { no: 300, name: "SIP_STATUS_MULTIPLE_CHOICES" },
      { no: 301, name: "SIP_STATUS_MOVED_PERMANENTLY" },
      { no: 302, name: "SIP_STATUS_MOVED_TEMPORARILY" },
      { no: 305, name: "SIP_STATUS_USE_PROXY" },
      { no: 380, name: "SIP_STATUS_ALTERNATIVE_SERVICE" },
      { no: 400, name: "SIP_STATUS_BAD_REQUEST" },
      { no: 401, name: "SIP_STATUS_UNAUTHORIZED" },
      { no: 402, name: "SIP_STATUS_PAYMENT_REQUIRED" },
      { no: 403, name: "SIP_STATUS_FORBIDDEN" },
      { no: 404, name: "SIP_STATUS_NOTFOUND" },
      { no: 405, name: "SIP_STATUS_METHOD_NOT_ALLOWED" },
      { no: 406, name: "SIP_STATUS_NOT_ACCEPTABLE" },
      { no: 407, name: "SIP_STATUS_PROXY_AUTH_REQUIRED" },
      { no: 408, name: "SIP_STATUS_REQUEST_TIMEOUT" },
      { no: 409, name: "SIP_STATUS_CONFLICT" },
      { no: 410, name: "SIP_STATUS_GONE" },
      { no: 411, name: "SIP_STATUS_LENGTH_REQUIRED" },
      { no: 412, name: "SIP_STATUS_CONDITIONAL_REQUEST_FAILED" },
      { no: 413, name: "SIP_STATUS_REQUEST_ENTITY_TOO_LARGE" },
      { no: 414, name: "SIP_STATUS_REQUEST_URI_TOO_LONG" },
      { no: 415, name: "SIP_STATUS_UNSUPPORTED_MEDIA_TYPE" },
      { no: 416, name: "SIP_STATUS_REQUESTED_RANGE_NOT_SATISFIABLE" },
      { no: 417, name: "SIP_STATUS_UNKNOWN_RESOURCE_PRIORITY" },
      { no: 420, name: "SIP_STATUS_BAD_EXTENSION" },
      { no: 421, name: "SIP_STATUS_EXTENSION_REQUIRED" },
      { no: 422, name: "SIP_STATUS_SESSION_INTERVAL_TOO_SMALL" },
      { no: 423, name: "SIP_STATUS_INTERVAL_TOO_BRIEF" },
      { no: 424, name: "SIP_STATUS_BAD_LOCATION_INFORMATION" },
      { no: 425, name: "SIP_STATUS_BAD_ALERT_MESSAGE" },
      { no: 428, name: "SIP_STATUS_USE_IDENTITY_HEADER" },
      { no: 429, name: "SIP_STATUS_PROVIDE_REFERRER_IDENTITY" },
      { no: 430, name: "SIP_STATUS_FLOW_FAILED" },
      { no: 433, name: "SIP_STATUS_ANONYMITY_DISALLOWED" },
      { no: 436, name: "SIP_STATUS_BAD_IDENTITY_INFO" },
      { no: 437, name: "SIP_STATUS_UNSUPPORTED_CERTIFICATE" },
      { no: 438, name: "SIP_STATUS_INVALID_IDENTITY_HEADER" },
      { no: 439, name: "SIP_STATUS_FIRST_HOP_LACKS_OUTBOUND_SUPPORT" },
      { no: 440, name: "SIP_STATUS_MAX_BREADTH_EXCEEDED" },
      { no: 469, name: "SIP_STATUS_BAD_INFO_PACKAGE" },
      { no: 470, name: "SIP_STATUS_CONSENT_NEEDED" },
      { no: 480, name: "SIP_STATUS_TEMPORARILY_UNAVAILABLE" },
      { no: 481, name: "SIP_STATUS_CALL_TRANSACTION_DOES_NOT_EXISTS" },
      { no: 482, name: "SIP_STATUS_LOOP_DETECTED" },
      { no: 483, name: "SIP_STATUS_TOO_MANY_HOPS" },
      { no: 484, name: "SIP_STATUS_ADDRESS_INCOMPLETE" },
      { no: 485, name: "SIP_STATUS_AMBIGUOUS" },
      { no: 486, name: "SIP_STATUS_BUSY_HERE" },
      { no: 487, name: "SIP_STATUS_REQUEST_TERMINATED" },
      { no: 488, name: "SIP_STATUS_NOT_ACCEPTABLE_HERE" },
      { no: 489, name: "SIP_STATUS_BAD_EVENT" },
      { no: 491, name: "SIP_STATUS_REQUEST_PENDING" },
      { no: 493, name: "SIP_STATUS_UNDECIPHERABLE" },
      { no: 494, name: "SIP_STATUS_SECURITY_AGREEMENT_REQUIRED" },
      { no: 500, name: "SIP_STATUS_INTERNAL_SERVER_ERROR" },
      { no: 501, name: "SIP_STATUS_NOT_IMPLEMENTED" },
      { no: 502, name: "SIP_STATUS_BAD_GATEWAY" },
      { no: 503, name: "SIP_STATUS_SERVICE_UNAVAILABLE" },
      { no: 504, name: "SIP_STATUS_GATEWAY_TIMEOUT" },
      { no: 505, name: "SIP_STATUS_VERSION_NOT_SUPPORTED" },
      { no: 513, name: "SIP_STATUS_MESSAGE_TOO_LARGE" },
      { no: 600, name: "SIP_STATUS_GLOBAL_BUSY_EVERYWHERE" },
      { no: 603, name: "SIP_STATUS_GLOBAL_DECLINE" },
      { no: 604, name: "SIP_STATUS_GLOBAL_DOES_NOT_EXIST_ANYWHERE" },
      { no: 606, name: "SIP_STATUS_GLOBAL_NOT_ACCEPTABLE" },
      { no: 607, name: "SIP_STATUS_GLOBAL_UNWANTED" },
      { no: 608, name: "SIP_STATUS_GLOBAL_REJECTED" }
    ]
  );
  var SIPTransport = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPTransport",
    [
      { no: 0, name: "SIP_TRANSPORT_AUTO" },
      { no: 1, name: "SIP_TRANSPORT_UDP" },
      { no: 2, name: "SIP_TRANSPORT_TCP" },
      { no: 3, name: "SIP_TRANSPORT_TLS" }
    ]
  );
  var SIPHeaderOptions = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPHeaderOptions",
    [
      { no: 0, name: "SIP_NO_HEADERS" },
      { no: 1, name: "SIP_X_HEADERS" },
      { no: 2, name: "SIP_ALL_HEADERS" }
    ]
  );
  var SIPMediaEncryption = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPMediaEncryption",
    [
      { no: 0, name: "SIP_MEDIA_ENCRYPT_DISABLE" },
      { no: 1, name: "SIP_MEDIA_ENCRYPT_ALLOW" },
      { no: 2, name: "SIP_MEDIA_ENCRYPT_REQUIRE" }
    ]
  );
  var ProviderType = /* @__PURE__ */ proto3.makeEnum(
    "livekit.ProviderType",
    [
      { no: 0, name: "PROVIDER_TYPE_UNKNOWN", localName: "UNKNOWN" },
      { no: 1, name: "PROVIDER_TYPE_INTERNAL", localName: "INTERNAL" },
      { no: 2, name: "PROVIDER_TYPE_EXTERNAL", localName: "EXTERNAL" }
    ]
  );
  var SIPCallStatus = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPCallStatus",
    [
      { no: 0, name: "SCS_CALL_INCOMING" },
      { no: 1, name: "SCS_PARTICIPANT_JOINED" },
      { no: 2, name: "SCS_ACTIVE" },
      { no: 3, name: "SCS_DISCONNECTED" },
      { no: 4, name: "SCS_ERROR" }
    ]
  );
  var SIPTransferStatus = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPTransferStatus",
    [
      { no: 0, name: "STS_TRANSFER_ONGOING" },
      { no: 1, name: "STS_TRANSFER_FAILED" },
      { no: 2, name: "STS_TRANSFER_SUCCESSFUL" }
    ]
  );
  var SIPFeature = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPFeature",
    [
      { no: 0, name: "NONE" },
      { no: 1, name: "KRISP_ENABLED" }
    ]
  );
  var SIPCallDirection = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPCallDirection",
    [
      { no: 0, name: "SCD_UNKNOWN" },
      { no: 1, name: "SCD_INBOUND" },
      { no: 2, name: "SCD_OUTBOUND" }
    ]
  );
  var SIPStatus = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPStatus",
    () => [
      { no: 1, name: "code", kind: "enum", T: proto3.getEnumType(SIPStatusCode) },
      {
        no: 2,
        name: "status",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var CreateSIPTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateSIPTrunkRequest",
    () => [
      { no: 1, name: "inbound_addresses", kind: "scalar", T: 9, repeated: true },
      {
        no: 2,
        name: "outbound_address",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "outbound_number",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "inbound_numbers_regex", kind: "scalar", T: 9, repeated: true },
      { no: 9, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 5,
        name: "inbound_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "inbound_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "outbound_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "outbound_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 10,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var ProviderInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ProviderInfo",
    () => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "type", kind: "enum", T: proto3.getEnumType(ProviderType) },
      {
        no: 4,
        name: "prevent_transfer",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var SIPTrunkInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPTrunkInfo",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 14, name: "kind", kind: "enum", T: proto3.getEnumType(SIPTrunkInfo_TrunkKind) },
      { no: 2, name: "inbound_addresses", kind: "scalar", T: 9, repeated: true },
      {
        no: 3,
        name: "outbound_address",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "outbound_number",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 13, name: "transport", kind: "enum", T: proto3.getEnumType(SIPTransport) },
      { no: 5, name: "inbound_numbers_regex", kind: "scalar", T: 9, repeated: true },
      { no: 10, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 6,
        name: "inbound_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "inbound_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "outbound_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 9,
        name: "outbound_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 11,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 12,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPTrunkInfo_TrunkKind = /* @__PURE__ */ proto3.makeEnum(
    "livekit.SIPTrunkInfo.TrunkKind",
    [
      { no: 0, name: "TRUNK_LEGACY" },
      { no: 1, name: "TRUNK_INBOUND" },
      { no: 2, name: "TRUNK_OUTBOUND" }
    ]
  );
  var CreateSIPInboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateSIPInboundTrunkRequest",
    () => [
      { no: 1, name: "trunk", kind: "message", T: SIPInboundTrunkInfo }
    ]
  );
  var UpdateSIPInboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSIPInboundTrunkRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "replace", kind: "message", T: SIPInboundTrunkInfo, oneof: "action" },
      { no: 3, name: "update", kind: "message", T: SIPInboundTrunkUpdate, oneof: "action" }
    ]
  );
  var SIPInboundTrunkInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPInboundTrunkInfo",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 4, name: "numbers", kind: "scalar", T: 9, repeated: true },
      { no: 5, name: "allowed_addresses", kind: "scalar", T: 9, repeated: true },
      { no: 6, name: "allowed_numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 7,
        name: "auth_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "auth_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 9, name: "headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 10, name: "headers_to_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 14, name: "attributes_to_headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 15, name: "include_headers", kind: "enum", T: proto3.getEnumType(SIPHeaderOptions) },
      { no: 11, name: "ringing_timeout", kind: "message", T: Duration },
      { no: 12, name: "max_call_duration", kind: "message", T: Duration },
      {
        no: 13,
        name: "krisp_enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 16, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption) },
      { no: 17, name: "created_at", kind: "message", T: Timestamp },
      { no: 18, name: "updated_at", kind: "message", T: Timestamp }
    ]
  );
  var SIPInboundTrunkUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPInboundTrunkUpdate",
    () => [
      { no: 1, name: "numbers", kind: "message", T: ListUpdate },
      { no: 2, name: "allowed_addresses", kind: "message", T: ListUpdate },
      { no: 3, name: "allowed_numbers", kind: "message", T: ListUpdate },
      { no: 4, name: "auth_username", kind: "scalar", T: 9, opt: true },
      { no: 5, name: "auth_password", kind: "scalar", T: 9, opt: true },
      { no: 6, name: "name", kind: "scalar", T: 9, opt: true },
      { no: 7, name: "metadata", kind: "scalar", T: 9, opt: true },
      { no: 8, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption), opt: true }
    ]
  );
  var CreateSIPOutboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateSIPOutboundTrunkRequest",
    () => [
      { no: 1, name: "trunk", kind: "message", T: SIPOutboundTrunkInfo }
    ]
  );
  var UpdateSIPOutboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSIPOutboundTrunkRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "replace", kind: "message", T: SIPOutboundTrunkInfo, oneof: "action" },
      { no: 3, name: "update", kind: "message", T: SIPOutboundTrunkUpdate, oneof: "action" }
    ]
  );
  var SIPOutboundTrunkInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPOutboundTrunkInfo",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "address",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 14,
        name: "destination_country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "transport", kind: "enum", T: proto3.getEnumType(SIPTransport) },
      { no: 6, name: "numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 7,
        name: "auth_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "auth_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 9, name: "headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 10, name: "headers_to_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 11, name: "attributes_to_headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 12, name: "include_headers", kind: "enum", T: proto3.getEnumType(SIPHeaderOptions) },
      { no: 13, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption) },
      {
        no: 15,
        name: "from_host",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 16, name: "created_at", kind: "message", T: Timestamp },
      { no: 17, name: "updated_at", kind: "message", T: Timestamp }
    ]
  );
  var SIPOutboundTrunkUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPOutboundTrunkUpdate",
    () => [
      { no: 1, name: "address", kind: "scalar", T: 9, opt: true },
      { no: 2, name: "transport", kind: "enum", T: proto3.getEnumType(SIPTransport), opt: true },
      { no: 9, name: "destination_country", kind: "scalar", T: 9, opt: true },
      { no: 3, name: "numbers", kind: "message", T: ListUpdate },
      { no: 4, name: "auth_username", kind: "scalar", T: 9, opt: true },
      { no: 5, name: "auth_password", kind: "scalar", T: 9, opt: true },
      { no: 6, name: "name", kind: "scalar", T: 9, opt: true },
      { no: 7, name: "metadata", kind: "scalar", T: 9, opt: true },
      { no: 8, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption), opt: true },
      { no: 10, name: "from_host", kind: "scalar", T: 9, opt: true }
    ]
  );
  var GetSIPInboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.GetSIPInboundTrunkRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var GetSIPInboundTrunkResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.GetSIPInboundTrunkResponse",
    () => [
      { no: 1, name: "trunk", kind: "message", T: SIPInboundTrunkInfo }
    ]
  );
  var GetSIPOutboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.GetSIPOutboundTrunkRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var GetSIPOutboundTrunkResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.GetSIPOutboundTrunkResponse",
    () => [
      { no: 1, name: "trunk", kind: "message", T: SIPOutboundTrunkInfo }
    ]
  );
  var ListSIPTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPTrunkRequest",
    () => [
      { no: 1, name: "page", kind: "message", T: Pagination }
    ]
  );
  var ListSIPTrunkResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPTrunkResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: SIPTrunkInfo, repeated: true }
    ]
  );
  var ListSIPInboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPInboundTrunkRequest",
    () => [
      { no: 3, name: "page", kind: "message", T: Pagination },
      { no: 1, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "numbers", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ListSIPInboundTrunkResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPInboundTrunkResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: SIPInboundTrunkInfo, repeated: true }
    ]
  );
  var ListSIPOutboundTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPOutboundTrunkRequest",
    () => [
      { no: 3, name: "page", kind: "message", T: Pagination },
      { no: 1, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "numbers", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ListSIPOutboundTrunkResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPOutboundTrunkResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: SIPOutboundTrunkInfo, repeated: true }
    ]
  );
  var DeleteSIPTrunkRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteSIPTrunkRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPDispatchRuleDirect = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRuleDirect",
    () => [
      {
        no: 1,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "pin",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPDispatchRuleIndividual = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRuleIndividual",
    () => [
      {
        no: 1,
        name: "room_prefix",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "pin",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "no_randomness",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var SIPDispatchRuleCallee = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRuleCallee",
    () => [
      {
        no: 1,
        name: "room_prefix",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "pin",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "randomize",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      }
    ]
  );
  var SIPDispatchRule = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRule",
    () => [
      { no: 1, name: "dispatch_rule_direct", kind: "message", T: SIPDispatchRuleDirect, oneof: "rule" },
      { no: 2, name: "dispatch_rule_individual", kind: "message", T: SIPDispatchRuleIndividual, oneof: "rule" },
      { no: 3, name: "dispatch_rule_callee", kind: "message", T: SIPDispatchRuleCallee, oneof: "rule" }
    ]
  );
  var CreateSIPDispatchRuleRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateSIPDispatchRuleRequest",
    () => [
      { no: 10, name: "dispatch_rule", kind: "message", T: SIPDispatchRuleInfo },
      { no: 1, name: "rule", kind: "message", T: SIPDispatchRule },
      { no: 2, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
      {
        no: 3,
        name: "hide_phone_number",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 6, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 4,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 7, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 8,
        name: "room_preset",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 9, name: "room_config", kind: "message", T: RoomConfiguration }
    ]
  );
  var UpdateSIPDispatchRuleRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.UpdateSIPDispatchRuleRequest",
    () => [
      {
        no: 1,
        name: "sip_dispatch_rule_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "replace", kind: "message", T: SIPDispatchRuleInfo, oneof: "action" },
      { no: 3, name: "update", kind: "message", T: SIPDispatchRuleUpdate, oneof: "action" }
    ]
  );
  var SIPDispatchRuleInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRuleInfo",
    () => [
      {
        no: 1,
        name: "sip_dispatch_rule_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "rule", kind: "message", T: SIPDispatchRule },
      { no: 3, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
      {
        no: 4,
        name: "hide_phone_number",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 7, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
      { no: 13, name: "numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 5,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 8, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 9,
        name: "room_preset",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 10, name: "room_config", kind: "message", T: RoomConfiguration },
      {
        no: 11,
        name: "krisp_enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 12, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption) },
      { no: 14, name: "created_at", kind: "message", T: Timestamp },
      { no: 15, name: "updated_at", kind: "message", T: Timestamp }
    ]
  );
  var SIPDispatchRuleUpdate = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPDispatchRuleUpdate",
    () => [
      { no: 1, name: "trunk_ids", kind: "message", T: ListUpdate },
      { no: 2, name: "rule", kind: "message", T: SIPDispatchRule },
      { no: 3, name: "name", kind: "scalar", T: 9, opt: true },
      { no: 4, name: "metadata", kind: "scalar", T: 9, opt: true },
      { no: 5, name: "attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 6, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption), opt: true }
    ]
  );
  var ListSIPDispatchRuleRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPDispatchRuleRequest",
    () => [
      { no: 3, name: "page", kind: "message", T: Pagination },
      { no: 1, name: "dispatch_rule_ids", kind: "scalar", T: 9, repeated: true },
      { no: 2, name: "trunk_ids", kind: "scalar", T: 9, repeated: true }
    ]
  );
  var ListSIPDispatchRuleResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.ListSIPDispatchRuleResponse",
    () => [
      { no: 1, name: "items", kind: "message", T: SIPDispatchRuleInfo, repeated: true }
    ]
  );
  var DeleteSIPDispatchRuleRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.DeleteSIPDispatchRuleRequest",
    () => [
      {
        no: 1,
        name: "sip_dispatch_rule_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPOutboundConfig = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPOutboundConfig",
    () => [
      {
        no: 1,
        name: "hostname",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "destination_country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "transport", kind: "enum", T: proto3.getEnumType(SIPTransport) },
      {
        no: 3,
        name: "auth_username",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "auth_password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "headers_to_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 6, name: "attributes_to_headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 8,
        name: "from_host",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var CreateSIPParticipantRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.CreateSIPParticipantRequest",
    () => [
      {
        no: 1,
        name: "sip_trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 20, name: "trunk", kind: "message", T: SIPOutboundConfig },
      {
        no: 2,
        name: "sip_call_to",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 15,
        name: "sip_number",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "participant_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "participant_metadata",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 9, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      {
        no: 5,
        name: "dtmf",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "play_ringtone",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 13,
        name: "play_dialtone",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 10,
        name: "hide_phone_number",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 16, name: "headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 17, name: "include_headers", kind: "enum", T: proto3.getEnumType(SIPHeaderOptions) },
      { no: 11, name: "ringing_timeout", kind: "message", T: Duration },
      { no: 12, name: "max_call_duration", kind: "message", T: Duration },
      {
        no: 14,
        name: "krisp_enabled",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 18, name: "media_encryption", kind: "enum", T: proto3.getEnumType(SIPMediaEncryption) },
      {
        no: 19,
        name: "wait_until_answered",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 21, name: "display_name", kind: "scalar", T: 9, opt: true },
      { no: 22, name: "destination", kind: "message", T: Destination, opt: true }
    ]
  );
  var SIPParticipantInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPParticipantInfo",
    () => [
      {
        no: 1,
        name: "participant_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "sip_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var TransferSIPParticipantRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TransferSIPParticipantRequest",
    () => [
      {
        no: 1,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "transfer_to",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "play_dialtone",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      { no: 5, name: "headers", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 6, name: "ringing_timeout", kind: "message", T: Duration }
    ]
  );
  var SIPCallInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPCallInfo",
    () => [
      {
        no: 1,
        name: "call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "trunk_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 16,
        name: "dispatch_rule_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 17,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "room_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "room_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "participant_identity",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 18, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 6, name: "from_uri", kind: "message", T: SIPUri },
      { no: 7, name: "to_uri", kind: "message", T: SIPUri },
      {
        no: 9,
        name: "created_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 10,
        name: "started_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 11,
        name: "ended_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 14, name: "enabled_features", kind: "enum", T: proto3.getEnumType(SIPFeature), repeated: true },
      { no: 15, name: "call_direction", kind: "enum", T: proto3.getEnumType(SIPCallDirection) },
      { no: 8, name: "call_status", kind: "enum", T: proto3.getEnumType(SIPCallStatus) },
      {
        no: 22,
        name: "created_at_ns",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 23,
        name: "started_at_ns",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 24,
        name: "ended_at_ns",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 12, name: "disconnect_reason", kind: "enum", T: proto3.getEnumType(DisconnectReason) },
      {
        no: 13,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 19, name: "call_status_code", kind: "message", T: SIPStatus },
      {
        no: 20,
        name: "audio_codec",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 21,
        name: "media_encryption",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 25,
        name: "pcap_file_link",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 26, name: "call_context", kind: "message", T: Any, repeated: true },
      { no: 27, name: "provider_info", kind: "message", T: ProviderInfo },
      {
        no: 28,
        name: "sip_call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var SIPTransferInfo = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPTransferInfo",
    () => [
      {
        no: 1,
        name: "transfer_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "call_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "transfer_to",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "transfer_initiated_at_ns",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 5,
        name: "transfer_completed_at_ns",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      { no: 6, name: "transfer_status", kind: "enum", T: proto3.getEnumType(SIPTransferStatus) },
      {
        no: 7,
        name: "error",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 8, name: "transfer_status_code", kind: "message", T: SIPStatus }
    ]
  );
  var SIPUri = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.SIPUri",
    () => [
      {
        no: 1,
        name: "user",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "host",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "ip",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "port",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 5, name: "transport", kind: "enum", T: proto3.getEnumType(SIPTransport) }
    ]
  );
  var Destination = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.Destination",
    () => [
      {
        no: 1,
        name: "city",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "country",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "region",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var TokenSourceRequest = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TokenSourceRequest",
    () => [
      { no: 1, name: "room_name", kind: "scalar", T: 9, opt: true },
      { no: 2, name: "participant_name", kind: "scalar", T: 9, opt: true },
      { no: 3, name: "participant_identity", kind: "scalar", T: 9, opt: true },
      { no: 4, name: "participant_metadata", kind: "scalar", T: 9, opt: true },
      { no: 5, name: "participant_attributes", kind: "map", K: 9, V: {
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      } },
      { no: 6, name: "room_config", kind: "message", T: RoomConfiguration, opt: true }
    ]
  );
  var TokenSourceResponse = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.TokenSourceResponse",
    () => [
      {
        no: 1,
        name: "server_url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "participant_token",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]
  );
  var WebhookEvent = /* @__PURE__ */ proto3.makeMessageType(
    "livekit.WebhookEvent",
    () => [
      {
        no: 1,
        name: "event",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "room", kind: "message", T: Room },
      { no: 3, name: "participant", kind: "message", T: ParticipantInfo },
      { no: 9, name: "egress_info", kind: "message", T: EgressInfo },
      { no: 10, name: "ingress_info", kind: "message", T: IngressInfo },
      { no: 8, name: "track", kind: "message", T: TrackInfo },
      {
        no: 6,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "created_at",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 11,
        name: "num_dropped",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]
  );
  var version = "1.45.1";
  return __toCommonJS(index_exports);
})();
window.LKProto = __LKProtoTmp;
