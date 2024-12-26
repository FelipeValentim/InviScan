﻿using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventRepository :  RepositoryBase<InviScanDbContext, Event>, IEventRepository
    {
        public EventRepository(InviScanDbContext context) : base(context)
        {
        }

        public IEnumerable<Event> GetEvents(Guid userId)
        {
            return GetAll(x => x.UserId == userId, includeProperties: "EventType");
        }

        public Event GetEventWithGuests(Guid eventId)
        {
            return Get(x => x.Id == eventId, includeProperties: "Guests");
        }
    }
}