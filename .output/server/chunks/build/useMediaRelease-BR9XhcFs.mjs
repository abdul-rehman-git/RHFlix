const useMediaRelease = () => {
  const isComingSoon = (item) => {
    if (!item) return false;
    if ("status" in item && item.status) {
      const unreleasedStatuses = [
        "Post Production",
        "In Production",
        "Planned",
        "Rumored",
        "Canceled",
        "Upcoming"
      ];
      if (unreleasedStatuses.includes(item.status)) {
        return true;
      }
    }
    const dateStr = item.release_date || item.first_air_date || item.air_date;
    if (!dateStr || typeof dateStr !== "string" || dateStr.trim().length === 0) {
      if ("status" in item && item.status) {
        return !["Released", "Ended", "Returning Series"].includes(item.status);
      }
      return false;
    }
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const trimmedDate = dateStr.trim();
      if (trimmedDate.length === 4) {
        return parseInt(trimmedDate, 10) > parseInt(today.substring(0, 4), 10);
      }
      if (trimmedDate.length === 7) {
        return trimmedDate > today.substring(0, 7);
      }
      return trimmedDate > today;
    } catch (_) {
      return false;
    }
  };
  const formatReleaseDate = (item) => {
    if (!item) return "Coming Soon";
    const dateStr = item.release_date || item.first_air_date || item.air_date;
    if (!dateStr) return "Coming Soon";
    try {
      const trimmed = dateStr.trim();
      if (trimmed.length === 4) return trimmed;
      const d = new Date(trimmed);
      if (isNaN(d.getTime())) return trimmed;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (_) {
      return dateStr;
    }
  };
  const canPlay = (item) => {
    return !isComingSoon(item);
  };
  return {
    isComingSoon,
    formatReleaseDate,
    canPlay
  };
};

export { useMediaRelease as u };
//# sourceMappingURL=useMediaRelease-BR9XhcFs.mjs.map
